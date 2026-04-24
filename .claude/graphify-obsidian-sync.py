"""
Regenerates the Obsidian vault from the existing graphify-out/graph.json.
Runs via SessionStart hook — no LLM needed, reads cached graph only.
"""
import json
import sys
from pathlib import Path

graph_path = Path("graphify-out/graph.json")
if not graph_path.exists():
    sys.exit(0)

try:
    from networkx.readwrite import json_graph
    from graphify.export import to_obsidian
except ImportError as e:
    print(f"[graphify-obsidian-sync] missing dep: {e}")
    sys.exit(0)

try:
    data = json.loads(graph_path.read_text(encoding="utf-8"))
    G = json_graph.node_link_graph(data, edges="links")

    # Rebuild communities dict from node attributes
    communities: dict[int, list] = {}
    for nid, ndata in G.nodes(data=True):
        cid = int(ndata.get("community", 0))
        communities.setdefault(cid, []).append(nid)

    obsidian_dir = "graphify-out/obsidian"
    n = to_obsidian(G, communities, obsidian_dir)
    print(f"[graphify-obsidian-sync] vault refreshed — {n} notes in {obsidian_dir}/")
except Exception as exc:
    print(f"[graphify-obsidian-sync] skipped: {exc}")
    sys.exit(0)
