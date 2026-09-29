"""Regression checks for the isolated Generic-host Docker setup."""

import json
from pathlib import Path

import frappe
from frappe.tests.utils import FrappeTestCase
from jinja2 import Template


ROOT = Path(__file__).resolve().parents[3]


class TestGenericServerSetup(FrappeTestCase):
    def tearDown(self):
        frappe.db.rollback()
        super().tearDown()

    def test_generic_docker_daemon_accepts_private_registry(self):
        template = Template(
            (ROOT / "playbooks/roles/docker/templates/daemon.json.j2").read_text()
        )
        settings = json.loads(
            template.render(
                cloud_provider="Generic", docker_registry_url="10.144.133.1:5000"
            )
        )
        self.assertEqual(settings["insecure-registries"], ["10.144.133.1:5000"])

    def test_other_clouds_do_not_inherit_private_registry(self):
        template = Template(
            (ROOT / "playbooks/roles/docker/templates/daemon.json.j2").read_text()
        )
        settings = json.loads(
            template.render(
                cloud_provider="Hetzner", docker_registry_url="10.144.133.1:5000"
            )
        )
        self.assertNotIn("insecure-registries", settings)
        self.assertEqual(settings["mtu"], 1450)

    def test_build_uses_public_ecr_without_legacy_dockerfile_frontend(self):
        dockerfile = (ROOT / "docker/Dockerfile").read_text()
        self.assertTrue(
            dockerfile.startswith("FROM public.ecr.aws/docker/library/ubuntu:22.04")
        )
        self.assertNotIn("docker/dockerfile:experimental", dockerfile)

    def test_ssh_proxy_build_uses_available_base_image(self):
        dockerfile = (ROOT / "docker/ssh_proxy/Dockerfile").read_text()
        self.assertTrue(
            dockerfile.startswith("FROM public.ecr.aws/docker/library/ubuntu:20.04")
        )
        self.assertNotIn("docker/dockerfile:experimental", dockerfile)
