from unittest.mock import patch

import frappe
from frappe.tests.utils import FrappeTestCase

from press.api.site import validate_self_hosted_free_site_creation


class TestSelfHostedFreeSite(FrappeTestCase):
	def test_free_team_must_use_shared_free_plan(self):
		team = frappe._dict(self_hosted_free_account=1)
		with (
			patch("press.api.site.get_current_team", return_value=team),
			patch.object(frappe.db, "get_single_value", return_value="Self-Hosted Free"),
		):
			validate_self_hosted_free_site_creation({"plan": "Self-Hosted Free"})
			for site in (
				{"plan": "Paid"},
				{"plan": "Self-Hosted Free", "server": "dedicated"},
			):
				with self.assertRaisesRegex(frappe.ValidationError, "self-hosted free plan"):
					validate_self_hosted_free_site_creation(site)

	def test_website_user_can_use_only_configured_free_site_plan(self):
		site = frappe.new_doc("Site")
		site.team = "free-team"
		site.server = "shared-server"
		site.subscription_plan = "Self-Hosted Free"
		site.apps = []

		def get_value(doctype, name, fieldname, **kwargs):
			if doctype == "Site Plan":
				return frappe._dict(price_inr=0, price_usd=0, dedicated_server_plan=0, is_trial_plan=0)
			if doctype == "Team":
				return 1
			if doctype == "Server" and fieldname == "public":
				return 1
			if doctype == "Server" and fieldname == "provider":
				return "Generic"
			return None

		with (
			patch.object(frappe.db, "get_all", return_value=[]),
			patch.object(frappe.db, "get_value", side_effect=get_value),
			patch.object(frappe.db, "get_single_value", return_value="Self-Hosted Free"),
			patch("press.press.doctype.site.site.is_system_user", return_value=False),
		):
			site.validate_site_plan()
			site.subscription_plan = "Another Plan"
			with self.assertRaisesRegex(frappe.ValidationError, "only use the self-hosted free plan"):
				site.validate_site_plan()
