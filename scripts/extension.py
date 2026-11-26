"""Package the built, local-only Thunderbird popup without web-only cache files."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
dist = root / "dist"
output = root / "build" / "biteradar-thunderbird.xpi"
output.parent.mkdir(exist_ok=True)
with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    archive.write(root / "extension" / "manifest.json", "manifest.json")
    for name in ["index.html", "favicon.svg", "icon-192.png", "icon-512.png", "manifest.webmanifest","awareness-kit.md"]:
        archive.write(dist / name, name)
    for path in sorted((dist / "assets").iterdir()):
        if path.is_file():
            archive.write(path, path.relative_to(dist))
    for path in sorted((dist / "learn").rglob("index.html")):
        archive.write(path,path.relative_to(dist))
print(output.name)

