"""Access checks for explicitly configured self-hosted free plans."""

from unittest.mock import patch

import frappe
from frappe.tests.utils import FrappeTestCase

from press.api.site import _is_plan_allowed_on_server


class TestSelfHostedSitePlanSelection(FrappeTestCase):
    def tearDown(self):
        frappe.db.rollback()
        super().tearDown()

    def test_enabled_free_plan_is_allowed_on_generic_server(self):
        plan = {
            "name": "Self-Hosted Free",
            "enabled": 1,
            "price_usd": 0,
            "price_inr": 0,
        }
        with (
            patch.object(
                frappe.db, "get_single_value", return_value="Self-Hosted Free"
            ),
            patch.object(frappe.db, "get_value", return_value="Generic"),
        ):
            self.assertTrue(_is_plan_allowed_on_server("generic.example", plan))

    def test_free_plan_is_not_allowed_on_other_clouds(self):
        plan = {
            "name": "Self-Hosted Free",
            "enabled": 1,
            "price_usd": 0,
            "price_inr": 0,
        }
        with (
            patch.object(
                frappe.db, "get_single_value", return_value="Self-Hosted Free"
            ),
            patch.object(frappe.db, "get_value", return_value="Hetzner"),
        ):
            self.assertFalse(_is_plan_allowed_on_server("cloud.example", plan))

    def test_disabled_free_plan_is_not_allowed_on_generic_server(self):
        plan = {
            "name": "Self-Hosted Free",
            "enabled": 0,
            "price_usd": 0,
            "price_inr": 0,
        }
        with patch.object(
            frappe.db, "get_single_value", return_value="Self-Hosted Free"
        ):
            self.assertFalse(_is_plan_allowed_on_server("generic.example", plan))
