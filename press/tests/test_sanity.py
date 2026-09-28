from unittest.mock import patch

import frappe
from frappe.core.doctype.scheduled_job_type.scheduled_job_type import insert_events
from frappe.tests.utils import FrappeTestCase

from press import sanity
from press.hooks import scheduler_events


class TestSanity(FrappeTestCase):
	def test_browser_sanity_skips_missing_arm64_driver(self):
		with (
			patch.dict("os.environ", {"CI": ""}),
			patch("press.sanity.platform.machine", return_value="aarch64"),
			patch("press.sanity.os.path.exists", return_value=False),
			patch("press.sanity.initialize_webdriver") as initialize_webdriver,
		):
			sanity.checks()

		initialize_webdriver.assert_not_called()

	def test_browser_sanity_runs_on_other_architectures(self):
		with (
			patch.dict("os.environ", {"CI": ""}),
			patch("press.sanity.platform.machine", return_value="x86_64"),
			patch("press.sanity.initialize_webdriver", return_value=False) as initialize_webdriver,
		):
			sanity.checks()

		initialize_webdriver.assert_called_once()

	def test_valid_scheduler_events(self):
		for event in insert_events(scheduler_events):
			frappe.get_attr(event)
