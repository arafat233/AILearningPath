# Topic 1: System Design Basics — Framework and Estimation

**Module**: M43 | **Difficulty**: ⭐⭐⭐⭐⭐⭐

## Key Concepts
- SD Framework: Requirements→Estimation→API→Data Model→Core Algorithm→Scale
- Capacity estimation: daily÷86400=per-second; add 10x peak buffer
- Always ask functional vs non-functional requirements
- CAP theorem: choose CP or AP; CA = single node
- Start with 1-server design, identify bottlenecks, scale each layer

## Files: topic.json, exercises.json, project.json, README.md
