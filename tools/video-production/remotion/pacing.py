"""Source-speed-preserving timing contract for product demo footage."""


def realtime_hold_frames(source_seconds: float, target_frames: int, fps: int,
                         max_hold_seconds: float = 0.24) -> int:
    """Permit only a short natural endpoint hold; never slow a user interaction."""
    if fps <= 0 or source_seconds <= 0 or target_frames <= 0:
        raise ValueError("Positive source duration, frame budget and fps required")
    original_frames = round(source_seconds * fps)
    hold = max(0, target_frames - original_frames)
    if hold > round(max_hold_seconds * fps):
        raise ValueError(
            f"Shot would extend {source_seconds:.2f}s of true-time action "
            f"to {target_frames/fps:.2f}s. Recapture or reduce duration."
        )
    return hold
