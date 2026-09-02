# External Dependency Status

## Overview
This document tracks the readiness of external dependencies required for the live production rollout of the MoSPI AI Learning Platform.

## 1. Network & Infrastructure
- **DNS Provisioning**: PENDING (Awaiting `.gov.in` domain allocation from NIC).
- **SSL/TLS Certificates**: PENDING (Awaiting domain to provision Let's Encrypt or NIC CA certificates).
- **Load Balancer Configuration**: READY.
- **Egress Firewall Rules**: READY (Required ports 443 opened for external API communication).

## 2. iGOT Karmayogi Integration
- **API Keys Provisioned**: NO.
- **Whitelist Status**: PENDING.
- **Rate Limit Agreement**: TBD.
- **Current Mode**: `MOCK`

## 3. NSSTA Programme Integration
- **API Keys Provisioned**: NO.
- **Whitelist Status**: PENDING.
- **Rate Limit Agreement**: TBD.
- **Current Mode**: `MOCK`

## 4. Google Gemini API (AI Layer)
- **API Keys Provisioned**: YES.
- **Quota Limit**: Standard tier (requires enterprise bump for full 5000+ user rollout).
- **Current Mode**: `LIVE` (with Graceful Deterministic Fallback).
