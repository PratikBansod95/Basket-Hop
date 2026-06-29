# Background assets

| File | Used for |
|------|----------|
| `sky-day.png` | Full-screen sky (merged through court transparent top) |
| `court-open-transparent.png` | Open rooftop court — **top is green-screen → transparent** on load |
| `court-open-sky.png` | Older version with baked-in sky (not used) |
| `cloud.png` | Optional cloud sprites |

Ball and hoop stay procedural.

## Layering

1. `sky-day.png` (screen, behind everything)
2. `court-open-transparent.png` (court + walls; empty sky area shows `sky-day` through)
