"""Regression tests: the director must not slow browser interactions to fill slots."""
import unittest
from pacing import realtime_hold_frames


class RealtimePacingTest(unittest.TestCase):
    def test_allows_original_source_speed(self):
        self.assertEqual(realtime_hold_frames(0.64, 16, 25), 0)

    def test_allows_only_short_end_hold(self):
        self.assertEqual(realtime_hold_frames(0.64, 20, 25), 4)

    def test_rejects_prior_fourfold_stretch(self):
        with self.assertRaisesRegex(ValueError, "Recapture or reduce duration"):
            realtime_hold_frames(0.64, 55, 25)

    def test_rejects_earlier_three_second_hours_shot(self):
        with self.assertRaises(ValueError):
            realtime_hold_frames(0.76, 74, 25)

    def test_rejects_bad_metadata(self):
        for values in [(-1, 20, 25), (0.64, 0, 25), (0.64, 20, 0)]:
            with self.subTest(values=values), self.assertRaises(ValueError):
                realtime_hold_frames(*values)


if __name__ == '__main__':
    unittest.main()
