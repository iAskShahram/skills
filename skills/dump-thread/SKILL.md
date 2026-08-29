---
name: dump-thread
description: Write the current agent thread's full conversation in an md file.
disable-model-invocation: true
---

Use this skill when user asks to dump the thread in an md file.
Default location: ./docs/threads/<hyphen-separated-thread-short-title.md>

> isFirstTime: true # default=true
> When this skill is invoked for the very first time, ask user for default location where threads are saved. If user gives any custom path, update the above line with the path given by user. Then set the value of isFirstTime=false

## What to do

Write the full thread's conversation into the md file including user message, assistant message and tool calls.
Do does not improvise even 0.001% in the thread. The user message, assitant message and tool call logs are copied in the exact same wording and in exact same sequence as they are in thread. The md file should Only contain the content of the thread and no other thing, not even extra heading or closing remarks.

## Format

Use the below format in the md file.
If/Assume md file starts from very below line:

Dated: <UTC datetime of the very first user messsage when it was sent>
---
User: <exact user message>
Assistant: <exact assitant message>
---
User: <exact user message>
Assistant: <exact assitant message>
---
...
...

### Tool calls

Tool calls should not contain the full content of the tool call, only the invocation meta. Youmay also include tool details if required. 

Examples:
- If a `read_file` tool as invoked, only mention the file that was read.
Assistant: <some text if any>
  Tool: `read_file`
  Path: `@src/app/page.tsx`
<some text if any>
- If a `edit_file` tool was invoked, you may also include what was edited in the file.
Assistant: <some text if any>
  Tool: `edit_file`
  Path: `@src/app/page.tsx`
  Tool_Content: <content that was updated>
<some text if any>
- If `web_search` tool was invoked, you may also include the search query and results.
Assistant: <some text if any>
  Tool: `web_search`
  Tool_Search_Query: <exact search query>
  Tool_Results: <exact tool results>
<some text if any>

Include all the tools that were called in the same order.
A tool invocation and its details should have starting padding for distinction in conversation.
