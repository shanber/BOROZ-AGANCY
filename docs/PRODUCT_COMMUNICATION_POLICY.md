# BOROZ Product Rule: In-Platform Project Communication

## Decision

After a merchant request is accepted and a provider/freelancer is selected or assigned, all project-related communication between the merchant and provider must happen inside BOROZ.

BOROZ must not build or encourage WhatsApp-based project communication, direct personal messaging, or other off-platform communication for active project work.

## Product Rationale

BOROZ protects both the merchant and the provider by keeping the project record inside the platform:

- messages
- files
- delivery notes
- revision requests
- scope changes
- approvals
- dispute evidence

This gives admins enough context to support both parties, resolve disputes, and audit project progress.

## Future Terms Copy

Use this copy in relevant project, offer, contract, and workspace flows:

> لضمان حقوق الطرفين، يجب أن يتم التواصل المتعلق بالمشروع داخل منصة بروز.

## Required Future Behavior

### Before Request Approval Or Provider Selection

- Merchant cannot directly message providers.
- Provider cannot directly message the merchant.
- Admin reviews the request first.
- The inbox may show system notifications, but it must not enable direct project chat before matching/activation.

### After Provider Selection Or Offer Acceptance

Create a dedicated project or order workspace.

Route concepts:

- `/dashboard/projects/[projectId]`
- `/dashboard/orders/[orderId]/workspace`

The workspace should include:

- Overview
- Chat
- Files
- Contract
- Delivery
- Revisions
- Activity timeline

### Chat Behavior

- Chat opens only after the project/order is active.
- Chat is tied to the project workspace, not a general inbox thread.
- Messages are visible to the merchant and assigned provider.
- Admin can review messages when needed for disputes, moderation, or support.
- Avoid exposing direct personal contact details between merchant and provider after matching unless admin explicitly decides otherwise.

### Files And Delivery

- Files can be shared inside project chat.
- Important files should also appear in the project file center.
- Final delivery must not be only a chat message.
- Final delivery requires a separate `تسليم المشروع` action with delivery records.

### Dispute Support

If a dispute is opened, admin should be able to review:

- contract/scope
- chat messages
- uploaded files
- delivery records
- revision requests
- activity timeline

## Architecture Implications

Future offers, projects, contracts, delivery, revisions, files, and dispute features must be designed around an in-platform project workspace as the source of truth.

The general inbox may exist as a notification center, but actual project communication must be inside the project/order workspace.

Do not implement direct off-platform contact exchange as a normal product path.
