"""Keep self-hosted Press site creation free while payment is not launched."""

import frappe


BLOCKED = (
    ".invoice.",
    ".payment_",
    ".razorpay_",
    ".billing_",
    "partner_billing_audit",
    "credit_referral_bonuses",
    "suspend_prepaid_subscriptions",
    "subscription.subscription.create_usage_records",
    "usage_record.link_unlinked_usage_records",
    "team.suspend_sites.execute",
    "site.site.create_subscription_for_trial_sites",
    "server.server.archive_servers_with_unpaid_invoices",
)

frappe.init(site="press.myyr.top")
frappe.connect()
try:
    frappe.set_user("Administrator")
    disabled = []
    for job in frappe.get_all(
        "Scheduled Job Type", fields=["name", "method", "stopped"]
    ):
        if job.method.startswith("press.") and any(
            marker in job.method for marker in BLOCKED
        ):
            if not job.stopped:
                frappe.db.set_value(
                    "Scheduled Job Type", job.name, "stopped", 1
                )
                disabled.append(job.method)
    frappe.db.commit()
    print("Disabled billing/payment scheduled jobs:", len(disabled))
    for method in sorted(disabled):
        print(method)
finally:
    frappe.destroy()
