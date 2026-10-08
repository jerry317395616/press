import frappe
from frappe.tests.utils import FrappeTestCase


class TestPressSignupEntry(FrappeTestCase):
	def test_public_entry_routes_open_press_dashboard_auth(self):
		redirects = frappe.get_hooks("website_redirects")
		self.assertIn(
			{"source": "/", "target": "/dashboard/login", "redirect_http_status": 302},
			redirects,
		)
		self.assertIn(
			{"source": "/signup", "target": "/dashboard/signup", "redirect_http_status": 302},
			redirects,
		)

	def test_system_login_signup_section_links_to_press_registration(self):
		template_path = frappe.get_hooks("signup_form_template")[-1]
		self.assertEqual(template_path, "press/templates/press_signup.html")
		content = frappe.get_template(template_path).render()
		self.assertIn('href="/dashboard/signup"', content)
		self.assertNotIn("form-signup", content)
