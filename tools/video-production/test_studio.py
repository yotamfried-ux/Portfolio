import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

from studio import atoms, make_plan, timestamp


class EditPlanTest(unittest.TestCase):
    def setUp(self):
        self.entries = {"demo.mp4": {"duration": 9, "width": 1920, "height": 1080}}
        self.config = {
            "roles": [{"id": "close", "after": ["open"], "seconds": 1},
                      {"id": "open", "after": [], "seconds": 2}],
            "candidates": [
                {"id": name, "role": role, "score": score, "source": "demo.mp4", "in": 1, "out": 2}
                for name, role, score in [("low", "open", 1), ("high", "open", 8), ("end", "close", 9)]
            ],
            "fps": 25,
            "duration": 19.12,
        }

    def test_selects_evidence_and_orders_roles_independently_of_input_order(self):
        first = make_plan(self.config, self.entries)
        self.config["roles"].reverse()
        self.config["candidates"].reverse()
        second = make_plan(self.config, self.entries)
        self.assertEqual(first, second)
        self.assertEqual([s["id"] for s in first["shots"]], ["high", "end"])
        self.assertEqual(first["shots"][-1]["end_frame"], 478)
        self.assertEqual(first["shots"][0]["end_frame"], first["shots"][1]["start_frame"])

    def test_out_of_bounds_and_invalid_crop_are_rejected(self):
        candidate = self.config["candidates"][0]
        candidate["out"] = 9.4
        with self.assertRaisesRegex(ValueError, "invalid range"):
            make_plan(self.config, self.entries)
        candidate.update({"out": 2, "crop": [3, 0, 1920, 1080]})
        with self.assertRaisesRegex(ValueError, "crop"):
            make_plan(self.config, self.entries)

    def test_cycle_is_rejected(self):
        self.config["roles"][1]["after"] = ["close"]
        with self.assertRaisesRegex(ValueError, "cyclic"):
            make_plan(self.config, self.entries)

    def test_optional_title_reserves_frames_and_vtt_rounds_cleanly(self):
        self.config["title_card"] = True
        self.assertEqual(make_plan(self.config, self.entries)["shots"][0]["start_frame"], 30)
        self.assertEqual(timestamp(89999, 25), "00:59:59.960")

    def test_mp4_box_checker_rejects_out_of_bounds(self):
        with TemporaryDirectory() as directory:
            path = Path(directory) / "bad.mp4"
            path.write_bytes(bytes.fromhex("0000001f") + b"mdat")
            with self.assertRaisesRegex(ValueError, "MP4 box length"):
                atoms(path)


if __name__ == "__main__":
    unittest.main()
