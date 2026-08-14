**COPY-001** · `floor_system` · sentence · RUNNING
> Raptor is an agentic AI and XR training academy for enterprise and media education, where the mechanical work of teaching a technical class is carried out by agents that an instructor directs in ordinary language.

**COPY-002** · `floor_system` · paragraph
> The building is the academy seen from above. Each floor is a working area, each office belongs to one agent, and each desk is a capability that agent can be asked to perform. Opening any of them shows what that part actually does, what it runs on, and whether it is running today or drawn here as part of the layout.

**COPY-003** · `floor_system` · deep.specs[0]
> The entire system runs locally on one 48 GB workstation GPU. Language inference is served by llama.cpp on a single machine, image and mesh generation share the same card, and no part of the teaching path depends on a hosted model.

**COPY-004** · `floor_system` · deep.specs[1]
> Work that has been performed correctly once is captured as a recipe with a scorer attached, and is re-run afterward by a smaller local model rather than re-authored. One hundred and thirteen recipes are registered.

**COPY-005** · `office_aribot` · sentence · RUNNING
> AriBot is the orchestrator, and it is the agent an instructor talks to when they do not know which agent they need.

**COPY-006** · `office_aribot` · paragraph
> AriBot receives requests in a Discord channel, decides which agent and which recipe answers them, and dispatches the work. It holds the state that the other agents read and write, so that a scene change made by one agent is visible to the rest, and it reports back into the same channel the request arrived in.

**COPY-007** · `office_aribot` · deep.specs[0]
> Qwen3.6-35B-A3B served by llama.cpp on port 8090, sharing a single 49,140 MiB workstation card with the image and mesh generators, and bound to the full recipe index and to the Discord and world-state tool sets.

**COPY-008** · `office_anabot` · sentence · RUNNING
> TABot is the teaching assistant, and its first working capability is turning what someone says out loud into a structured plan the class can act on.

**COPY-009** · `office_anabot` · paragraph
> When a session is recorded, TABot transcribes it locally, organises the unstructured speech into ranked priorities with a weekly working structure, and posts the result into the class channel with every point quoting the exact words it came from. That cited record is the substrate the rest of the assistant is built on: what is due and who is waiting, platform answers drawn from a card store the instructor writes and corrects, and escalation to the instructor with the context attached.

**COPY-010** · `office_anabot` · deep.specs[0]
> Shares the local inference substrate with the other agents and is distinguished by its recipe family and tool binding rather than by a separate model. Transcription runs on a local Whisper large-v3 service on the same machine, and the organising step runs on the same local language model as the rest of the academy.

**COPY-011** · `office_edbot` · sentence · RUNNING
> StreamBot produces the class, and it is the agent that keeps a teaching stream running while the instructor teaches.

**COPY-012** · `office_edbot` · paragraph
> StreamBot drives OBS directly: it switches scenes, starts and stops recording, and confirms each change by reading the state back rather than assuming the command landed. It holds a cue sheet of the session's segments and can move forward, jump to a named point, or repeat one, which means a class that goes wrong in the middle does not have to start again from the beginning.

**COPY-013** · `office_edbot` · deep.specs[0]
> Connects to OBS over its WebSocket interface on port 4455. Scene switches are verified by read-back and fail loudly on mismatch. The session cue sheet records which segments can be re-entered and which cannot.

**COPY-014** · `office_artbot` · sentence · SPECIFIED
> XRBot builds the module, and it is the agent that turns a description into something a student can walk into.

**COPY-015** · `office_artbot` · paragraph
> XRBot generates images and meshes from recorded workflows, assembles them with the scene code into a WebXR module, and publishes it. Because the generation step records the exact workflow that produced each asset, an asset that is lost or needs a variation is reproduced from that record rather than re-prompted from scratch.

**COPY-016** · `office_artbot` · deep.specs[0]
> Dispatches to a local ComfyUI instance sharing the same GPU, and to TRELLIS for mesh generation. Every generated asset is written to an index carrying the hash of the workflow that produced it; the index currently holds three hundred and twenty-one entries.

**COPY-017** · `desk_aribot_orchestrate` · sentence · RUNNING
> Orchestration decides which agent and which recipe answers a request, and dispatches it.

**COPY-018** · `desk_aribot_orchestrate` · paragraph
> A request arrives as ordinary language and is matched against the registered recipe index. When a recipe covers it, the recipe runs and its scorer grades the result. When nothing covers it, the request is refused with the reason stated rather than answered approximately, which is what keeps the boundary between what the system can do and what it cannot from blurring in use.

**COPY-019** · `desk_aribot_discord` · sentence · RUNNING
> Discord is where the academy is operated from, and every request and result passes through it.

**COPY-020** · `desk_aribot_discord` · paragraph
> Each module has its own channel, and a channel is bound to the recipe family that serves it, so asking in the right room is how the system knows what kind of work is being requested. Commands and mentions are authorised per user and per channel, and results are posted back into the channel the request came from so the whole exchange stays in one readable place.

**COPY-021** · `desk_aribot_world_state` · sentence · SPECIFIED
> World state is the shared record of what the scene currently contains, and it is what stops two agents from contradicting each other.

**COPY-022** · `desk_aribot_world_state` · paragraph
> Changes are broadcast over a WebSocket connection to every attached surface, so a mesh built by one agent appears in the running scene without the page being reloaded. Each change is timed against a stated latency class, which makes a slow update a measurable failure rather than a matter of impression.

**COPY-023** · `desk_anabot_assignments` · sentence · RUNNING
> Assignment intake takes what a person submits, spoken or written, and turns it into a structured record with citations.

**COPY-024** · `desk_anabot_assignments` · paragraph
> The intake step reads unstructured material and returns ranked priorities, a weekly working structure, an estimate of how many questions the work will raise each week, and an estimate of the time required to scaffold it. Every claim carries a citation quoting the exact span of the source it came from, and those spans are located by the system rather than reported by the model, which is what stops a summary from inventing something the speaker did not say. That record is what deadline tracking and group coordination sit on. Measured end to end on a real session recording: 12.8 seconds from stopping the recording to a cited, structured plan, of which 8.6 seconds is transcription and 4.2 seconds is organising. The model supplies quoted text only; the character offsets that anchor each citation are computed afterwards in Python, so a quotation that was never spoken fails to resolve and the run stops rather than reporting it.

**COPY-025** · `desk_anabot_questions` · sentence · SPECIFIED
> Question handling asks what a request left unclear, and escalates what it cannot answer.

**COPY-026** · `desk_anabot_questions` · paragraph
> When intake finishes, the agent confirms what it received and asks a small number of follow-up questions, which is both how the remaining gaps get closed and how a person sees whether they were understood. Questions about how the platform itself works resolve against written cards the instructor authors and can correct, so that a student never receives an answer assembled from a model's general knowledge.

**COPY-027** · `desk_anabot_grading` · sentence · PLANNED
> Grading assistance scores work against the instructor's rubric and stops before the grade.

**COPY-028** · `desk_anabot_grading` · paragraph
> The rubric is written by the instructor, and the assistant's output is a draft score with the evidence for each line attached. Nothing reaches a student until the instructor has reviewed it, and the review is a required step rather than an option.

**COPY-029** · `desk_edbot_obs` · sentence · RUNNING
> Scene control switches what the stream is showing and confirms that it switched.

**COPY-030** · `desk_edbot_obs` · paragraph
> Each segment of a session is mapped to a scene, and switching reads the resulting state back from OBS and fails loudly if it does not match what was requested. Recording is started and stopped by the same path, and the inventory of available scenes and sources is refreshed automatically rather than depending on anyone remembering to refresh it.

**COPY-031** · `desk_edbot_routing` · sentence · SPECIFIED
> Feedback routing carries what students are saying to the instructor without interrupting them.

**COPY-032** · `desk_edbot_routing` · paragraph
> Questions and problems raised during a class are collected and surfaced in one place rather than arriving as an interruption, so the instructor decides when to look. The purpose is to absorb the technical friction of running a live session, which is the part of teaching this way that most often falls on the person least able to spare the attention.

**COPY-033** · `desk_edbot_xr` · sentence · PLANNED
> XR access issues credentials and hands a student into the environment.

**COPY-034** · `desk_edbot_xr` · paragraph
> Session credentials are distributed per class and expire with it, and the handoff places a student in the correct environment without a manual setup step. This is designed against the existing session and scene machinery and is not built.

**COPY-035** · `desk_artbot_asset_gen` · sentence · RUNNING
> Asset generation produces an image or a mesh and records exactly how it was produced.

**COPY-036** · `desk_artbot_asset_gen` · paragraph
> Generation runs on the local ComfyUI instance, and the resulting file is written to an index together with the hash of the workflow that made it. A missing or unsatisfactory asset is regenerated by recovering that workflow and changing one value in it, which is why a variation costs a parameter change rather than a new prompt and a new result.

**COPY-037** · `desk_artbot_module_build` · sentence · SPECIFIED
> Module build turns a spoken description into geometry inside a running scene.

**COPY-038** · `desk_artbot_module_build` · paragraph
> A sentence such as "floor twelve by twelve, walls three and a half metres high" is resolved into a structured intent in which every dimension is copied word for word from what was said, and a deterministic compiler converts the units, orders the operations and produces the geometry. The model never emits a coordinate or performs a conversion, and any value it returns that cannot be found in the original sentence causes the build to refuse rather than proceed.

**COPY-039** · `desk_artbot_deploy` · sentence · SPECIFIED
> Deployment publishes a finished module to the instructor's library.

**COPY-040** · `desk_artbot_deploy` · paragraph
> A published module is addressable and re-runnable, so teaching it again is a matter of opening it rather than rebuilding it. The publishing path itself is live and already serves the academy site; the module library that sits on top of it is specified and not yet populated.

**COPY-041** · `brain_aribot_model` · sentence · RUNNING
> AriBot thinks on a 35-billion-parameter model running on the workstation's own GPU.

**COPY-042** · `brain_aribot_model` · paragraph
> The model was chosen because it fits alongside image generation on a single card and because its job is interpretation rather than invention. It is asked to decide what a sentence means and which tool answers it, and it is prevented by contract from producing the values that go into that tool, which is what allows a comparatively small local model to do this work reliably.

**COPY-043** · `brain_aribot_model` · deep.specs[0]
> Qwen3.6-35B-A3B, served by llama.cpp on port 8090, resident on the same 49,140 MiB card that runs image and mesh generation, with no cloud inference anywhere in the path.

**COPY-044** · `brain_aribot_tools` · sentence · RUNNING
> AriBot's tools are the registered recipes, and the recipe index is the list of things it can do.

**COPY-045** · `brain_aribot_tools` · paragraph
> Each recipe names its inputs, the steps it performs and the scorer that grades its output, so the set of things the system can be asked for is a list that can be read rather than a capability that has to be discovered by trying. Dispatch, generation, scene control, verification and session summary are each a family within it.

**COPY-046** · `brain_aribot_memory` · sentence · RUNNING
> Memory is written to files on disk, and the files are the record.

**COPY-047** · `brain_aribot_memory` · paragraph
> What persists between sessions is written as documents in a vault that both the agents and the people read, rather than held inside a model. Session state is deliberately short-lived, so that recovering from a crash means reading the last written record rather than reconstructing what an agent was thinking.

**COPY-048** · `brain_aribot_loop` · sentence · RUNNING
> The loop plans, acts, observes the result, and grades it before continuing.

**COPY-049** · `brain_aribot_loop` · paragraph
> Every step produces an observable result, and the result is compared against the recipe's scorer rather than against the agent's own opinion of how it went. When the score fails, the loop stops and reports what failed instead of trying an alternative, because an agent that recovers silently removes the information the next run needs.

**COPY-050** · `brain_anabot_model` · sentence · RUNNING
> TABot runs on the same local model as the rest of the academy.

**COPY-051** · `brain_anabot_model` · paragraph
> Sharing one substrate across four agents is the reason the academy fits on one machine. What makes TABot different is not a different model but a different recipe family, a different tool binding and a different set of cards to answer from.

**COPY-052** · `brain_anabot_tools` · sentence · RUNNING
> TABot's tools are the transcription service, the organiser, the grounding check and the class channel.

**COPY-053** · `brain_anabot_tools` · paragraph
> A recording is transcribed locally, organised into a ranked plan by the local model, checked so that every quotation is found word for word in the transcript, and posted into the channel the class is already using. The card lookup, the assignment store and the escalation path bind to that same tool surface.

**COPY-054** · `brain_anabot_memory` · sentence · RUNNING
> TABot's durable memory is the cited plan it writes, which any reader can check against the recording.

**COPY-055** · `brain_anabot_memory` · paragraph
> Each plan it produces is a written record that quotes its own source, so it can be re-read and checked by anyone later rather than taken on trust. The longitudinal side is the same record accumulated per person — what each student has submitted and what remains outstanding — so that an answer given in week nine cites what was said in week two.

**COPY-056** · `brain_anabot_loop` · sentence · RUNNING
> TABot listens, transcribes, organises, checks its own quotations, and posts.

**COPY-057** · `brain_anabot_loop` · paragraph
> The checking step is the substance of it: if a quotation the model produced cannot be found in the transcript, the run fails rather than posting a plausible summary. The conservative threshold on the other side is the same instinct — a question not clearly covered goes to the instructor rather than being answered approximately, because the cost of an unnecessary escalation is a moment of the instructor's time and the cost of a confident wrong answer to a student is considerably higher.

**COPY-058** · `brain_edbot_model` · sentence · RUNNING
> StreamBot runs on the same local model, and most of what it does needs no model at all.

**COPY-059** · `brain_edbot_model` · paragraph
> Scene switching, recording and cue-sheet navigation are deterministic operations that run without inference, which is why they are fast enough to use during a live class and why they keep working if the language model is unavailable. The model is needed only for interpreting a spoken instruction into which of those operations to perform.

**COPY-060** · `brain_edbot_tools` · sentence · RUNNING
> StreamBot's tools are the OBS connection, the cue sheet and the scene map.

**COPY-061** · `brain_edbot_tools` · paragraph
> The OBS connection issues commands and verifies them by read-back. The cue sheet records the session's segments and which of them can be safely re-entered. The scene map is data rather than code, so changing which scene a segment shows is an edit to a file and not a change to the program.

**COPY-062** · `brain_edbot_memory` · sentence · RUNNING
> StreamBot remembers where it is in the session and what the stream is currently showing.

**COPY-063** · `brain_edbot_memory` · paragraph
> Position in the cue sheet is held explicitly rather than inferred, which is what allows the session to be resumed at the correct point after an interruption instead of being replayed from the beginning in front of a class.

**COPY-064** · `brain_edbot_loop` · sentence · RUNNING
> StreamBot waits for an event, acts on it, and confirms the result before reporting success.

**COPY-065** · `brain_edbot_loop` · paragraph
> The confirmation step is the substance of it. A scene switch that is issued but not verified looks identical to one that worked until the moment an audience is looking at the wrong thing, so the system reads the state back and treats a mismatch as a failure.

**COPY-066** · `brain_artbot_model` · sentence · RUNNING
> XRBot runs on the same local model and dispatches the heavy work to generation tools beside it.

**COPY-067** · `brain_artbot_model` · paragraph
> The language model decides what to make and which recorded workflow to use; the image and mesh models make it. Keeping those separate means the aesthetic result is governed by a workflow that a person curated and can adjust, rather than by a sentence that has to be rewritten until the output improves.

**COPY-068** · `brain_artbot_tools` · sentence · RUNNING
> XRBot's tools are the generation dispatcher, the asset index and the module assembler.

**COPY-069** · `brain_artbot_tools` · paragraph
> The dispatcher queues work to the local ComfyUI instance and to the mesh generator. The index records every produced asset together with the workflow that produced it. The assembler puts assets and scene code together into a module, and refuses to bind an asset that is not in the index rather than proceeding with a missing file.

**COPY-070** · `brain_artbot_memory` · sentence · RUNNING
> XRBot remembers how every asset it has ever made was made.

**COPY-071** · `brain_artbot_memory` · paragraph
> Each of the 198 indexed assets carries the hash of its generating workflow, so a file that is deleted, corrupted or needed in a different framing is recovered by re-running that exact workflow with one value changed. This is what makes the asset library durable rather than a folder of results nobody can reproduce.

**COPY-072** · `brain_artbot_loop` · sentence · SPECIFIED
> XRBot receives a request, generates, assembles, verifies and publishes.

**COPY-073** · `brain_artbot_loop` · paragraph
> Each stage has a check that has been shown to fail when the thing it protects is broken, which is the only reason the chain can be run without someone watching it. The full sequence is gated and has been proven one stage at a time; it has not yet been observed running end to end unattended.

**COPY-074** · `timeline_step_01` · sentence
> An instructor opens a class from the module's channel.

**COPY-075** · `timeline_step_01` · paragraph
> The request is a sentence in Discord rather than a sequence of applications being opened. AriBot matches it to the module's recipe family and dispatches the session setup, and StreamBot brings up the stream and the opening scene.

**COPY-076** · `timeline_step_02` · sentence
> The instructor describes the environment the class will work in.

**COPY-077** · `timeline_step_02` · paragraph
> The description is spoken in ordinary language and its dimensions are carried through unchanged into a structured intent. A deterministic compiler converts them and produces the geometry, and the room appears in the scene the class is already watching.

**COPY-078** · `timeline_step_03` · sentence
> The class asks for something to be added, and it is generated while they watch.

**COPY-079** · `timeline_step_03` · paragraph
> XRBot dispatches the request to the local generation tools and writes the result into the asset index together with the workflow that produced it. The asset is placed in the scene, and it is reproducible afterward without being described again.

**COPY-080** · `timeline_step_04` · sentence
> A student asks a question, and it reaches the instructor without stopping the class.

**COPY-081** · `timeline_step_04` · paragraph
> TABot confirms what it heard and asks the follow-up questions the request left open, passing anything outside its scope to the instructor with the context attached. StreamBot collects what is raised during the session so that it arrives in one place rather than as an interruption.

**COPY-082** · `timeline_step_05` · sentence
> The session ends and the recording is broken down automatically.

**COPY-083** · `timeline_step_05` · paragraph
> TABot transcribes the recording, organises what was said into ranked priorities with a weekly working structure, and posts it into the class channel with every point quoting the words it came from. What the class covered becomes a plan that can be checked against the recording rather than an hour of video.

**COPY-084** · `timeline_step_06` · sentence
> The module is published, and teaching it again means opening it.

**COPY-085** · `timeline_step_06` · paragraph
> Everything the session produced — the environment, the generated assets, the recording and its breakdown — is captured as a module that can be re-run, re-recorded and re-published without being authored a second time. The instructor is present for the same reasons they were the first time; what has been removed is the work of rebuilding the conditions for the class.
