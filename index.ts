// ./package.json > scripts > update > bun run index.ts

const TMP_DIR = "./tmp" as const;
const SKILLS_DIR = "./skills" as const;
const SKILL_NAMES = ["uncodixfy", "impeccable"] as const;
type SkillName = typeof SKILL_NAMES[number];
type SkillMeta = {
    skill_sh_script: string;
    github_repo: string;
    process: (repoDir: string, dest: string) => Promise<void>;
};

const UNCODIXFY_HEADER = `---
name: uncodixfy
description: Prevents generic AI/Codex UI patterns when generating frontend code. Use this skill whenever generating HTML, CSS, React, Vue, Svelte, or any frontend UI code to enforce clean, human-designed aesthetics inspired by Linear, Raycast, Stripe, and GitHub instead of typical AI-generated UI.
---

`;

const SKILLS_FROM_SKILL_SH: { [K in SkillName]: SkillMeta } = {
    uncodixfy: {
        skill_sh_script: "bunx skills add https://github.com/cyxzdev/uncodixfy --skill uncodixfy",
        github_repo: "https://github.com/cyxzdev/uncodixfy",
        async process(repoDir, dest) {
            const body = await Bun.file(`${repoDir}/Uncodixfy.md`).text();
            await Bun.$`rm -rf ${dest}`;
            await Bun.$`mkdir -p ${dest}`;
            await Bun.write(`${dest}/SKILL.md`, UNCODIXFY_HEADER + body);
        },
    },
    impeccable: {
        skill_sh_script: "bunx skills add https://github.com/pbakaus/impeccable --skill impeccable",
        github_repo: "https://github.com/pbakaus/impeccable",
        async process(repoDir, dest) {
            const skillRoot = await findSkillRoot(repoDir, "impeccable");
            await Bun.$`rm -rf ${dest}`;
            await Bun.$`mkdir -p ${dest}`;
            await Bun.$`cp -R ${skillRoot}/. ${dest}/`;
            await Bun.$`rm -rf ${dest}/.git`;
        },
    },
} as const;


import { $ } from "bun";
async function findSkillRoot(repoDir: string, skillName: SkillName): Promise<string> {
    const candidates = [
        `${repoDir}/skills/${skillName}`,
        `${repoDir}/skill/${skillName}`,
        `${repoDir}/${skillName}`,
        `${repoDir}/skill`,
        `${repoDir}/skills`,
        repoDir,
    ];
    for (const c of candidates) {
        if (await Bun.file(`${c}/SKILL.md`).exists()) return c;
    }
    // fallback: BFS for any directory containing SKILL.md
    const queue: string[] = [repoDir];
    while (queue.length) {
        const dir = queue.shift()!;
        const glob = new Bun.Glob("*");
        for await (const name of glob.scan({ cwd: dir, onlyFiles: false, dot: false })) {
            if (name === ".git" || name === "node_modules") continue;
            const sub = `${dir}/${name}`;
            if (await Bun.file(`${sub}/SKILL.md`).exists()) return sub;
            queue.push(sub);
        }
    }
    throw new Error(`SKILL.md not found in ${repoDir} for ${skillName}`);
}

async function processSkill(name: SkillName, meta: SkillMeta) {
    const repoDir = `${TMP_DIR}/${name}`;
    await $`rm -rf ${repoDir}`;
    console.log(`\n[${name}] cloning ${meta.github_repo}`);
    await $`git clone --depth 1 ${meta.github_repo} ${repoDir}`;

    const dest = `${SKILLS_DIR}/${name}`;
    console.log(`[${name}] processing -> ${dest}`);
    await meta.process(repoDir, dest);
}

async function main() {
    await $`mkdir -p ${TMP_DIR} ${SKILLS_DIR}`;

    for (const name of SKILL_NAMES) {
        try {
            await processSkill(name, SKILLS_FROM_SKILL_SH[name]);
        } catch (err) {
            console.error(`[${name}] failed:`, err);
        }
    }

    await $`rm -rf ${TMP_DIR}`;
    console.log("\nDone.");
}

await main();
