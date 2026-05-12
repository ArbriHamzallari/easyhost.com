"""
Replace the connected outer background of how-payout.png with pure white.

Uses BFS flood-fill from image corners so we only recolor pixels connected
to the edges (the grey studio backdrop), not whites inside the phone UI.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "public" / "images" / "how-payout.png"


def main() -> None:
    img = Image.open(PATH).convert("RGBA")
    arr = np.array(img, dtype=np.int16)
    h, w = arr.shape[0], arr.shape[1]
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]

    # Seed colors from corners (average)
    refs = np.stack(
        [
            rgb[0, 0],
            rgb[0, w - 1],
            rgb[h - 1, 0],
            rgb[h - 1, w - 1],
        ]
    )
    ref = np.round(refs.mean(axis=0)).astype(np.int16)
    tol = 14  # per-channel tolerance vs average corner

    def similar(y: int, x: int) -> bool:
        if not (0 <= y < h and 0 <= x < w):
            return False
        if alpha[y, x] < 128:
            return False
        px = rgb[y, x]
        return bool(np.all(np.abs(px - ref) <= tol))

    visited = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    for y, x in [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]:
        if similar(y, x) and not visited[y, x]:
            visited[y, x] = True
            q.append((y, x))

    while q:
        y, x = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and similar(
                ny, nx
            ):
                visited[ny, nx] = True
                q.append((ny, nx))

    out = arr.copy()
    out[visited, 0] = 255
    out[visited, 1] = 255
    out[visited, 2] = 255
    out[visited, 3] = 255

    Image.fromarray(out.astype(np.uint8), "RGBA").save(PATH, "PNG", optimize=True)
    n = int(visited.sum())
    print(f"Replaced {n} background pixels with white ({100 * n / (h * w):.1f}%)")


if __name__ == "__main__":
    main()
