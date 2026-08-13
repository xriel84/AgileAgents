# Copy Slots

Generated: 2026-08-12 (deck-as-data session)
Total placeholder count: 85 (50 label placeholders P001-P050, 85 copy slots COPY-001-COPY-085)

Each slot is a [COPY-NNN] placeholder in deck/content/nodes.json.
JP or Ari fills these via the set-copy verb — never by hand-editing nodes.json directly.

Format: slot | node_id | depth | agent | disclosure_level | what_it_must_say

---

## Floor

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-001] | floor_system | floor | _system | sentence | The one-liner for the whole building — what Raptor is in one sentence |
| [COPY-002] | floor_system | floor | _system | paragraph | 2-3 sentences: the building as an AI-powered studio; the demo factory metaphor |
| [COPY-003] | floor_system | floor | _system | deep.specs[0] | Technical stack or capability spec for the system |
| [COPY-004] | floor_system | floor | _system | deep.specs[1] | Second capability spec (e.g. live deployment, replayability claim) |

## Office — AriBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-005] | office_aribot | office | aribot | sentence | AriBot role in one line: orchestrator, Discord bot, world-state hub |
| [COPY-006] | office_aribot | office | aribot | paragraph | What AriBot does across the system; how it coordinates the other agents |
| [COPY-007] | office_aribot | office | aribot | deep.specs[0] | Technical spec: model, context window, tool set |

## Office — TABot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-008] | office_anabot | office | anabot | sentence | TABot role: student TA and LMS coordinator in one line |
| [COPY-009] | office_anabot | office | anabot | paragraph | How TABot manages assignments, student questions, async work groups, grading assistance |
| [COPY-010] | office_anabot | office | anabot | deep.specs[0] | Technical spec for TABot |

## Office — StreamBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-011] | office_edbot | office | edbot | sentence | StreamBot role: livestream producer in one line |
| [COPY-012] | office_edbot | office | edbot | paragraph | OBS control, XR login, routing student feedback, absorbing technical friction live |
| [COPY-013] | office_edbot | office | edbot | deep.specs[0] | Technical spec for StreamBot |

## Office — XRBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-014] | office_artbot | office | artbot | sentence | XRBot role: XR module builder in one line |
| [COPY-015] | office_artbot | office | artbot | paragraph | Turns AI-generated assets + code into new training modules; demo factory output |
| [COPY-016] | office_artbot | office | artbot | deep.specs[0] | Technical spec for XRBot |

## Desk — AriBot capabilities

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-017] | desk_aribot_orchestrate | desk | aribot | sentence | What the orchestration capability does in one line |
| [COPY-018] | desk_aribot_orchestrate | desk | aribot | paragraph | Expanded: how routing, priority, and agent dispatch work |
| [COPY-019] | desk_aribot_discord | desk | aribot | sentence | Discord integration capability in one line |
| [COPY-020] | desk_aribot_discord | desk | aribot | paragraph | Commands, slash integrations, @mentions, world-state relay |
| [COPY-021] | desk_aribot_world_state | desk | aribot | sentence | World-state broadcast capability in one line |
| [COPY-022] | desk_aribot_world_state | desk | aribot | paragraph | WebSocket hub, who writes state, who reads, conflict resolution |

## Desk — TABot capabilities

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-023] | desk_anabot_assignments | desk | anabot | sentence | Assignment management capability in one line |
| [COPY-024] | desk_anabot_assignments | desk | anabot | paragraph | LMS sync, deadline tracking, async group coordination |
| [COPY-025] | desk_anabot_questions | desk | anabot | sentence | Student question handling in one line |
| [COPY-026] | desk_anabot_questions | desk | anabot | paragraph | How TABot fields, queues, and escalates student questions |
| [COPY-027] | desk_anabot_grading | desk | anabot | sentence | Grading assistance capability in one line |
| [COPY-028] | desk_anabot_grading | desk | anabot | paragraph | Rubric-based scoring, instructor review gate, feedback generation |

## Desk — StreamBot capabilities

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-029] | desk_edbot_obs | desk | edbot | sentence | OBS control capability in one line |
| [COPY-030] | desk_edbot_obs | desk | edbot | paragraph | Scene switching, recording triggers, stream health monitoring |
| [COPY-031] | desk_edbot_routing | desk | edbot | sentence | Feedback routing capability in one line |
| [COPY-032] | desk_edbot_routing | desk | edbot | paragraph | Student feedback → instructor surface; friction absorption during live class |
| [COPY-033] | desk_edbot_xr | desk | edbot | sentence | XR login and access capability in one line |
| [COPY-034] | desk_edbot_xr | desk | edbot | paragraph | Credential distribution, session auth, XR environment handoff |

## Desk — XRBot capabilities

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-035] | desk_artbot_asset_gen | desk | artbot | sentence | Asset generation capability in one line |
| [COPY-036] | desk_artbot_asset_gen | desk | artbot | paragraph | ComfyUI dispatch, LoRA selection, output to index |
| [COPY-037] | desk_artbot_module_build | desk | artbot | sentence | Module build capability in one line |
| [COPY-038] | desk_artbot_module_build | desk | artbot | paragraph | Asset + code assembly into a deployable XR training module |
| [COPY-039] | desk_artbot_deploy | desk | artbot | sentence | Module deploy capability in one line |
| [COPY-040] | desk_artbot_deploy | desk | artbot | paragraph | Publish to instructor library; replayability without re-authoring |

## Brain substrates — AriBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-041] | brain_aribot_model | brain | aribot | sentence | The inference substrate: llama.cpp, context window, quantization level |
| [COPY-042] | brain_aribot_model | brain | aribot | paragraph | Expanded: why this model, what fits in context, determinism vs. creativity dial |
| [COPY-043] | brain_aribot_model | brain | aribot | deep.specs[0] | Exact spec: model id, parameter count, VRAM footprint |
| [COPY-044] | brain_aribot_tools | brain | aribot | sentence | Tool set in one line: what AriBot can invoke |
| [COPY-045] | brain_aribot_tools | brain | aribot | paragraph | Tool list with one-line purpose each |
| [COPY-046] | brain_aribot_memory | brain | aribot | sentence | Memory system in one line |
| [COPY-047] | brain_aribot_memory | brain | aribot | paragraph | What persists across sessions; what is ephemeral; the world-state contract |
| [COPY-048] | brain_aribot_loop | brain | aribot | sentence | Reasoning loop in one line |
| [COPY-049] | brain_aribot_loop | brain | aribot | paragraph | How the agent plan-act-observe cycle runs; interrupt conditions |

## Brain substrates — TABot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-050] | brain_anabot_model | brain | anabot | sentence | Inference substrate for TABot |
| [COPY-051] | brain_anabot_model | brain | anabot | paragraph | Model spec and LMS integration layer |
| [COPY-052] | brain_anabot_tools | brain | anabot | sentence | TABot tool set in one line |
| [COPY-053] | brain_anabot_tools | brain | anabot | paragraph | Tool list with one-line purpose |
| [COPY-054] | brain_anabot_memory | brain | anabot | sentence | TABot memory system in one line |
| [COPY-055] | brain_anabot_memory | brain | anabot | paragraph | Student records, assignment state, session context |
| [COPY-056] | brain_anabot_loop | brain | anabot | sentence | TABot reasoning loop in one line |
| [COPY-057] | brain_anabot_loop | brain | anabot | paragraph | How TABot processes student queries and escalation thresholds |

## Brain substrates — StreamBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-058] | brain_edbot_model | brain | edbot | sentence | Inference substrate for StreamBot |
| [COPY-059] | brain_edbot_model | brain | edbot | paragraph | Model spec; real-time latency requirements |
| [COPY-060] | brain_edbot_tools | brain | edbot | sentence | StreamBot tool set in one line |
| [COPY-061] | brain_edbot_tools | brain | edbot | paragraph | OBS WebSocket, XR auth, feedback pipe |
| [COPY-062] | brain_edbot_memory | brain | edbot | sentence | StreamBot memory in one line |
| [COPY-063] | brain_edbot_memory | brain | edbot | paragraph | Session context, scene state, active student count |
| [COPY-064] | brain_edbot_loop | brain | edbot | sentence | StreamBot reasoning loop in one line |
| [COPY-065] | brain_edbot_loop | brain | edbot | paragraph | Event-driven: OBS trigger → plan → act cycle |

## Brain substrates — XRBot

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-066] | brain_artbot_model | brain | artbot | sentence | Inference substrate for XRBot |
| [COPY-067] | brain_artbot_model | brain | artbot | paragraph | Model spec; creative vs. instructional balance |
| [COPY-068] | brain_artbot_tools | brain | artbot | sentence | XRBot tool set in one line |
| [COPY-069] | brain_artbot_tools | brain | artbot | paragraph | ComfyUI dispatch, code gen, module assembler |
| [COPY-070] | brain_artbot_memory | brain | artbot | sentence | XRBot memory in one line |
| [COPY-071] | brain_artbot_memory | brain | artbot | paragraph | Asset graph, module registry, instructor preferences |
| [COPY-072] | brain_artbot_loop | brain | artbot | sentence | XRBot reasoning loop in one line |
| [COPY-073] | brain_artbot_loop | brain | artbot | paragraph | Request → generate → assemble → publish cycle |

## Timeline steps

| Slot | Node | Depth | Agent | Level | Must say |
|------|------|-------|-------|-------|----------|
| [COPY-074] | timeline_step_01 | timeline | _system | sentence | Step 1 label: first event in the worked example |
| [COPY-075] | timeline_step_01 | timeline | _system | paragraph | What happens: which agents interact, what data flows |
| [COPY-076] | timeline_step_02 | timeline | _system | sentence | Step 2 label |
| [COPY-077] | timeline_step_02 | timeline | _system | paragraph | Step 2 interaction detail |
| [COPY-078] | timeline_step_03 | timeline | _system | sentence | Step 3 label |
| [COPY-079] | timeline_step_03 | timeline | _system | paragraph | Step 3 interaction detail |
| [COPY-080] | timeline_step_04 | timeline | _system | sentence | Step 4 label |
| [COPY-081] | timeline_step_04 | timeline | _system | paragraph | Step 4 interaction detail |
| [COPY-082] | timeline_step_05 | timeline | _system | sentence | Step 5 label |
| [COPY-083] | timeline_step_05 | timeline | _system | paragraph | Step 5 interaction detail |
| [COPY-084] | timeline_step_06 | timeline | _system | sentence | Step 6 label: final state / outcome |
| [COPY-085] | timeline_step_06 | timeline | _system | paragraph | What the system achieved; replayability claim (not autonomy claim) |

---

## Label placeholders (P-series)

50 label placeholders: [P001]–[P050].

Agent office labels are ALREADY SET (AriBot, TABot, StreamBot, XRBot — from role mapping).
Remaining: floor_system label [P001] + 34 desk/brain/timeline labels [P017]–[P050].
