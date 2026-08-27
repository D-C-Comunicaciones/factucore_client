# Graph Report - facturacion-cliente  (2026-08-26)

## Corpus Check
- 618 files · ~698,819 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2991 nodes · 8981 edges · 211 communities (137 shown, 74 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `699d4ec3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- ContactAdvancedForm.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewInvoiceMain.tsx
- users/page.tsx
- CostCenterTable.tsx
- sidebar.tsx
- alegra DESIGN.md
- QuoteTable.tsx
- react
- dashboard/page.tsx
- remissions/new/page.tsx
- button.tsx
- devDependencies
- useNotifications.ts
- compilerOptions
- cn
- types/items.ts
- NewQuoteSettingsDrawer.tsx
- components.json
- returns/[id]/page.tsx
- ReturnsTable.tsx
- TwoFactorPanel.tsx
- NewReminderModal.tsx
- showToast
- alegra DESIGN.md
- ReturnDetailDocument.tsx
- lib/utils.ts
- invoices/new/page.tsx
- InvoicesService
- quote.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- ContactTable.tsx
- ItemResponse
- invoice.ts
- NewPurchaseOrderForm.tsx
- activate-account/page.tsx
- IntegrationsService
- Órdenes de compra (`purchase_orders`) — CRUD y guía de integración
- ApiResponse
- useRoleMutations.ts
- PaymentTable.tsx
- tooltip.tsx
- quotes/[id]/page.tsx
- tasks/page.tsx
- ItemTable.tsx
- Header.tsx
- resolveStockFields
- carousel.tsx
- navigation-menu.tsx
- InvoiceTable.tsx
- CompanySummaryCard.tsx
- ItemDocumentsTab.tsx
- ResolutionForm.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- items/[id]/page.tsx
- contacts/[id]/page.tsx
- calculations.js
- auth-context.tsx
- ui/utils.ts
- remission.ts
- exports.md Reference Guide
- ReportsSections.tsx
- NewReturnForm.tsx
- App.jsx
- chart.tsx
- extractErrorMessage
- --update / --cluster-only subcommands (SKILL.md pointer)
- Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales
- input.tsx
- pagination.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- useCatalogs
- formatCurrency
- alegra DESIGN.md
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- alegra Design System
- useInvoices.ts
- react
- [filename]/page.tsx
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- useResolutions
- exportPdf.js
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- lucide-react
- pusher-js
- CuentasPorPagarWidget.tsx
- integrations/page.tsx
- invoice/InvoiceItemsTable.tsx
- cn
- @radix-ui/react-accordion
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- dependencies
- devDependencies
- dayjs
- package.json
- app/package.json
- proxy.ts
- alegra-design.skill
- initialBudget.js
- @radix-ui/react-menubar
- Component Patterns
- dependencies
- @dnd-kit/modifiers
- cotizaciones/page.tsx
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- .oxlintrc.json
- @hookform/resolvers
- html2canvas
- input-otp
- @radix-ui/react-slot
- next
- react-hook-form
- remissions/page.tsx
- alert.tsx
- clsx
- @radix-ui/react-checkbox
- UserInfoPanel.tsx
- 10. Agent Prompt Guide
- @radix-ui/react-label
- @radix-ui/react-progress
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- jspdf
- @radix-ui/react-tabs
- 4. Component Stylings
- @radix-ui/react-toggle-group
- @radix-ui/react-toggle
- postcss
- react-dom
- Spacing & Layout
- react-resizable-panels
- debounced-input.tsx
- SummaryPanel.jsx
- @radix-ui/react-aspect-ratio
- tailwind-merge
- @radix-ui/react-avatar
- @tanstack/query-sync-storage-persister
- 6. Depth & Elevation
- Color System
- DeleteWidgetDialog.tsx
- vaul
- @radix-ui/react-context-menu
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- Typography
- invoices/page.tsx
- React + Vite
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- EmptyDashboardState.tsx
- @radix-ui/react-hover-card
- @radix-ui/react-navigation-menu
- @radix-ui/react-radio-group
- ClientesConVentasWidget.tsx
- @radix-ui/react-select
- 7. Animation & Motion
- @radix-ui/react-separator
- @radix-ui/react-slider
- Animation & Motion
- BaseItemBasicInfo
- class-variance-authority
- ImpuestosWidget.tsx
- alegra Design System
- react-day-picker
- WidgetSkeleton.tsx
- SKILL.md
- tailwindcss-animate
- @tanstack/react-query
- zod
- @dnd-kit/core
- @dnd-kit/sortable
- @radix-ui/react-collapsible
- @radix-ui/react-tooltip
- @tanstack/react-table
- date-fns

## God Nodes (most connected - your core abstractions)
1. `react` - 361 edges
2. `showToast()` - 257 edges
3. `cn()` - 198 edges
4. `cn()` - 151 edges
5. `Button()` - 125 edges
6. `DialogContent()` - 61 edges
7. `DialogTitle()` - 61 edges
8. `Dialog()` - 60 edges
9. `DialogHeader()` - 58 edges
10. `useCatalogs()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Constrained Query Expansion (Step 0)` --semantically_similar_to--> `Domain-hint Whisper Prompt Strategy`  [INFERRED] [semantically similar]
  .claude/skills/graphify/references/query.md → .claude/skills/graphify/references/transcribe.md
- `CostCentersPage()` --calls--> `showToast()`  [EXTRACTED]
  src/app/(authenticated)/cost-centers/page.tsx → src/components/sonner/CustomToaster.tsx
- `ResolutionFormProps` --references--> `Resolution`  [EXTRACTED]
  src/components/resolution/ResolutionForm.tsx → src/lib/resolutions.ts
- `SidebarMenuItems()` --calls--> `showToast()`  [EXTRACTED]
  src/components/sidebar/Sidebar.tsx → src/components/sonner/CustomToaster.tsx
- `AccordionItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/components/ui/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (211 total, 74 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.22
Nodes (19): CertificateList(), CertificateListProps, ContactTableBodyProps, contactName(), PurchaseOrderDetailDocument(), ReturnsTableBodyProps, SoftwareList(), SoftwareListProps (+11 more)

### Community 1 - "ContactAdvancedForm.tsx"
Cohesion: 0.14
Nodes (21): NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm() (+13 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.07
Nodes (41): AttributeModalProps, NewCertificateModalProps, BulkEditContactsModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, PreviewModalProps, ProductGalleryModalProps, CreateWarehouseModalProps (+33 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.09
Nodes (24): ForgotPasswordPage(), CompanyProfileForm(), getInitials(), ChangeEmailDialog(), PasswordGateDialog(), useChangeEmail(), useUpdateCompanyProfile(), useVerifyPassword() (+16 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewInvoiceMain.tsx"
Cohesion: 0.10
Nodes (32): AddContactModal(), ContactAccountingInfoProps, ContactCommercialInfoProps, EditResolutionModal(), InvoiceItemsTable(), QuickCreateItemModal(), InvoiceItem, NewInvoiceViewProps (+24 more)

### Community 6 - "users/page.tsx"
Cohesion: 0.16
Nodes (18): NewCertificateForm(), NewCertificateFormProps, InvoiceDetailHeaderProps, PurchaseOrderStatusBadge(), StatusBadge(), DeleteConfirmDialogProps, NewSoftwareForm(), NewSoftwareFormProps (+10 more)

### Community 7 - "CostCenterTable.tsx"
Cohesion: 0.12
Nodes (19): CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter(), defaultCostCenterFilterOptions, CostCenterTableBody() (+11 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "alegra DESIGN.md"
Cohesion: 0.05
Nodes (36): 10. Agent Prompt Guide, 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Animation & Motion (+28 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.12
Nodes (20): defaultFilterOptions, QuoteFilter(), QuoteTable(), QuoteTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps (+12 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.11
Nodes (23): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, DevolucionesWidget(), DevolucionesWidgetProps, FlujoTransaccionesWidget() (+15 more)

### Community 13 - "remissions/new/page.tsx"
Cohesion: 0.07
Nodes (35): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), NewRemissionPageContent(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton() (+27 more)

### Community 14 - "button.tsx"
Cohesion: 0.08
Nodes (41): Contact, ContactType, AvatarInitials(), Contact, getColorFromName(), getInitials(), ContactFilterChipsProps, contactFilterOptions (+33 more)

### Community 15 - "devDependencies"
Cohesion: 0.09
Nodes (23): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+15 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.06
Nodes (52): NotificationBell(), parseApiDate(), timeAgo(), DueReminderPopup(), RemindersPanel(), showMentionNotificationToast(), showReplyNotificationToast(), formatDueAt() (+44 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "cn"
Cohesion: 0.05
Nodes (61): CustomFieldModal(), CustomFieldModalProps, FALLBACK_FIELD_TYPES, StatusToggle(), InfoChip(), InfoChip(), InfoField(), StatusToggle() (+53 more)

### Community 19 - "types/items.ts"
Cohesion: 0.07
Nodes (30): Image, BaseItemPayload, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings, CreateItemCustomField, CreateItemInitialStock (+22 more)

### Community 20 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.18
Nodes (17): CostCenter, NewCostCenterModal(), NewCostCenterModalProps, CreateCurrencyModalProps, NewCurrencyModal(), NewPriceListModal(), NewPriceListModalProps, FixedFields (+9 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "returns/[id]/page.tsx"
Cohesion: 0.11
Nodes (15): ReturnDetailPage(), ReturnsPage(), ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, extractCreditNote() (+7 more)

### Community 23 - "ReturnsTable.tsx"
Cohesion: 0.21
Nodes (9): ReturnPageHeader(), ReturnsFilterChips(), ReturnsTable(), ReturnsTableProps, ReturnsTableBody(), ReturnsTablePagination(), ReturnsTablePaginationProps, ReturnsTableToolbar() (+1 more)

### Community 24 - "TwoFactorPanel.tsx"
Cohesion: 0.10
Nodes (18): RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanelProps, InputOTP() (+10 more)

### Community 25 - "NewReminderModal.tsx"
Cohesion: 0.06
Nodes (56): CommentEditor(), ConnectedCommentsAndReminders(), formatDateTime(), initialsOf(), LegacyCommentsAndReminders(), MentionResults(), parseApiDate(), previewText() (+48 more)

### Community 26 - "showToast"
Cohesion: 0.10
Nodes (32): EditItemPage(), ItemDetailPage(), NewItemPage(), FormState, ItemsPage(), AttributeModal(), notifyComingSoon(), InlineDocumentSelector() (+24 more)

### Community 27 - "alegra DESIGN.md"
Cohesion: 0.05
Nodes (36): 10. Agent Prompt Guide, 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Depth & Elevation, 7. Animation & Motion (+28 more)

### Community 28 - "ReturnDetailDocument.tsx"
Cohesion: 0.23
Nodes (10): FactucoreLogo(), FactucoreLogoProps, InvoiceDetailDocumentProps, DianStatusBadge(), QuoteDetailDocumentProps, RemissionDetailDocument(), RemissionDetailDocumentProps, ReturnDetailDocumentProps (+2 more)

### Community 29 - "lib/utils.ts"
Cohesion: 0.09
Nodes (32): ItemImage, CategoryModalProps, NewCategoryModal(), BLANK_BASIC, QuickCreateItemModalProps, AccountingSection(), AdditionalFieldsSection(), GeneralInfoSection() (+24 more)

### Community 30 - "invoices/new/page.tsx"
Cohesion: 0.11
Nodes (30): NewInvoicePageContent(), EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePageContent(), NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps (+22 more)

### Community 31 - "InvoicesService"
Cohesion: 0.20
Nodes (3): InvoiceDetailPage(), InvoicesService, Invoice

### Community 32 - "quote.ts"
Cohesion: 0.07
Nodes (25): QuoteDetailPage(), ActionsCell(), INVOICE_KEY(), INVOICES_KEY, usePrefetchQuoteDetail(), useSendQuote(), useUpdateQuote(), QuotesService (+17 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.13
Nodes (12): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+4 more)

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.14
Nodes (17): defaultFilterOptions, RemissionFilter(), RemissionTableProps, ServerPagination, FilterChips(), FilterChipsProps, filterIcons, filterLabels (+9 more)

### Community 35 - "ContactTable.tsx"
Cohesion: 0.11
Nodes (18): ContactsRecyclePage(), ContactType, ResolutionsPage(), Contact, ContactTable(), ContactTableProps, ServerPagination, ContactDetailHeader() (+10 more)

### Community 36 - "ItemResponse"
Cohesion: 0.29
Nodes (7): TabConfig, ItemHeaderProps, ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ItemDetailViewProps, ItemResponse

### Community 37 - "invoice.ts"
Cohesion: 0.12
Nodes (16): AllowanceCharge, DianSubmissionStatus, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian (+8 more)

### Community 38 - "NewPurchaseOrderForm.tsx"
Cohesion: 0.05
Nodes (54): EditInternalPurchaseOrderPage(), toDateInput(), InternalPurchaseOrderDetailPage(), NewInternalPurchaseOrderPage(), InternalPurchaseOrdersPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), PurchaseOrdersPage() (+46 more)

### Community 39 - "activate-account/page.tsx"
Cohesion: 0.08
Nodes (24): ActivateAccountContent(), ConfirmEmailContent(), ResetPasswordContent(), AccountNotActivatedNotice(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), InvoiceStats (+16 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.05
Nodes (34): PaymentDetailPage(), NewPaymentPageContent(), ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), RotateSecretModal(), RotateSecretModalProps (+26 more)

### Community 41 - "Órdenes de compra (`purchase_orders`) — CRUD y guía de integración"
Cohesion: 0.14
Nodes (13): 1. Crear orden de compra, 2. Listar órdenes de compra, 3. Detalle de una orden de compra, 4. Editar orden de compra, 5. Eliminar orden de compra, `allowance_charges[]` (a nivel de línea o global, mismo shape), Body de cada línea en `items[]`, Ejemplo — `external` (orden del cliente) (+5 more)

### Community 42 - "ApiResponse"
Cohesion: 0.07
Nodes (21): NewRemissionOptions(), envs, UseItemsParams, ApiClient, AttributePayload, attributesApi, categoriesApi, currenciesApi (+13 more)

### Community 43 - "useRoleMutations.ts"
Cohesion: 0.12
Nodes (23): RoleDetailPage(), PermissionModuleGroup(), PermissionModuleGroupProps, RoleListbox(), RoleListboxProps, getModuleLabel(), PERMISSION_MODULE_LABELS, usePermissionsCatalog() (+15 more)

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.12
Nodes (20): PaymentsPage(), PaymentTable(), PaymentTableProps, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES (+12 more)

### Community 45 - "tooltip.tsx"
Cohesion: 0.11
Nodes (19): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, ClienteItem, MejoresClientesWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, SectionCard() (+11 more)

### Community 46 - "quotes/[id]/page.tsx"
Cohesion: 0.21
Nodes (7): QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.09
Nodes (24): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, InvoiceFilter(), ItemTable(), ItemTableProps, ServerPagination (+16 more)

### Community 49 - "Header.tsx"
Cohesion: 0.11
Nodes (15): Factucore Horizontal Logo, AccountSwitcher(), AccountSwitcherProps, HeaderProps, HelpCenterPopover(), HelpCenterPopoverProps, SolutionsPopover(), SolutionsPopoverProps (+7 more)

### Community 50 - "resolveStockFields"
Cohesion: 0.25
Nodes (16): ItemRow(), ProductComboModal(), ItemRow(), ItemRow(), ItemRow(), useItems(), getComboAvailableUnits(), getComboComponents() (+8 more)

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.12
Nodes (20): defaultFilterOptions, InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps, filterIcons (+12 more)

### Community 54 - "CompanySummaryCard.tsx"
Cohesion: 0.31
Nodes (5): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid()

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.13
Nodes (18): baseSchema, formSchema, ResolutionFormProps, FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue (+10 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 60 - "items/[id]/page.tsx"
Cohesion: 0.25
Nodes (5): ItemAccounting(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemMainInfo()

### Community 61 - "contacts/[id]/page.tsx"
Cohesion: 0.06
Nodes (34): ContactDetailPage(), AuthenticatedLayout(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailComments(), ContactDetailCommentsProps, ContactDetailGeneral() (+26 more)

### Community 62 - "calculations.js"
Cohesion: 0.24
Nodes (13): CADENCES, SavingsPlanCard(), TripForm(), computeBreakdown(), computeSavingsPlan(), daysBetween(), formatMoneyPlain(), itemTotal() (+5 more)

### Community 63 - "auth-context.tsx"
Cohesion: 0.10
Nodes (19): CompanyProfilePage(), metadata, LoginPage(), RootPage(), CustomToaster(), SplashScreen(), SplashScreenProps, ThemeProvider() (+11 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.10
Nodes (12): AccordionContent(), AccordionItem(), AccordionTrigger(), HoverCardContent(), ResizableHandle(), ResizablePanelGroup(), Slider(), ToggleGroup() (+4 more)

### Community 65 - "remission.ts"
Cohesion: 0.13
Nodes (14): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDian, RemissionEstablishment, RemissionFindAllEmpty (+6 more)

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "NewReturnForm.tsx"
Cohesion: 0.17
Nodes (9): ChangeClientModal(), ChangeTypeModal(), ExitFormModal(), AddedLine, NewReturnForm(), createEmptyLine(), FieldError, NewReturnForm() (+1 more)

### Community 69 - "App.jsx"
Cohesion: 0.22
Nodes (9): App(), loadBudget(), ExportBar(), Header(), ExtrasForm(), LocalTransportForm(), FoodForm(), StayForm() (+1 more)

### Community 70 - "chart.tsx"
Cohesion: 0.16
Nodes (15): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ProductoItem, ProductosMasVendidosWidget(), ProductosMasVendidosWidgetProps, ChartConfig, ChartContainer() (+7 more)

### Community 71 - "extractErrorMessage"
Cohesion: 0.13
Nodes (19): SecurityPage(), ChangePasswordDialog(), TwoFactorPanel(), TwoFactorSection(), ResetUserPasswordDialog(), useChangePassword(), useProfile(), useConfirmTwoFactor() (+11 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales"
Cohesion: 0.22
Nodes (8): Contrato de API actualizado, Edición (`PATCH /purchase-orders/{id}`), La respuesta ahora trae totales reales, Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales, Qué hay que agregar al formulario de items, Recapitulación: dos tipos de orden de compra (sigue igual), Resumen de lo que hay que construir/ajustar, Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

### Community 74 - "input.tsx"
Cohesion: 0.13
Nodes (27): AccountNotActivatedNoticeProps, PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, ContactDetailBranchesProps, CreateWebhookModalProps, ChangeEmailDialogProps, ChangePasswordDialogProps (+19 more)

### Community 75 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "useCatalogs"
Cohesion: 0.20
Nodes (12): EditContactContent(), ContactPage(), getSession(), SessionData, BulkEditContactsModal(), NewInvoiceMain(), NewQuoteMain(), NewRemissionMain() (+4 more)

### Community 80 - "formatCurrency"
Cohesion: 0.21
Nodes (10): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps (+2 more)

### Community 81 - "alegra DESIGN.md"
Cohesion: 0.14
Nodes (14): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 5. Layout Principles, 8. Do's and Don'ts, 9. Responsive Behavior, alegra DESIGN.md, Anti-Patterns (detected from codebase) (+6 more)

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "alegra Design System"
Cohesion: 0.15
Nodes (13): alegra Design System, Anti-Patterns (Never Do), Brand Spec, Depth & Elevation, Design Philosophy, Homepage, Page Structure, Quick Reference (+5 more)

### Community 86 - "useInvoices.ts"
Cohesion: 0.27
Nodes (9): InvoiceEditPage(), extractInvoiceFromDetail(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useSendInvoice(), useUpdateInvoice() (+1 more)

### Community 87 - "react"
Cohesion: 0.05
Nodes (21): react, CostCentersPage(), NewCertificateModal(), ContactDetailGeneralProps, ConfigCostCentersModal(), EmptyStateWidgetProps, routeTitles, ItemInventoryProps (+13 more)

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "useResolutions"
Cohesion: 0.14
Nodes (20): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, NewInvoicePayment(), ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns() (+12 more)

### Community 92 - "exportPdf.js"
Cohesion: 0.21
Nodes (7): exportBudgetExcel(), ACCENT, BORDER, INK, MUTED, SURFACE, formatDate()

### Community 93 - "catalogCache.ts"
Cohesion: 0.80
Nodes (4): canUseStorage(), getStorageKey(), readCatalogCache(), writeCatalogCache()

### Community 94 - "hooks.md Reference Guide"
Cohesion: 0.50
Nodes (4): graphify claude install/uninstall (CLAUDE.md integration), graphify hook install/uninstall/status, hooks.md Reference Guide, Commit hook and native CLAUDE.md integration (SKILL.md pointer)

### Community 95 - "transcribe.md Reference Guide"
Cohesion: 0.50
Nodes (4): transcribe.md Reference Guide, Domain-hint Whisper Prompt Strategy, Whisper Video/Audio Transcription (Step 2.5), Step 2.5: Video and audio transcription

### Community 96 - "Next.js Project (create-next-app bootstrap)"
Cohesion: 0.50
Nodes (4): create-next-app CLI, Geist Font (via next/font), Next.js Project (create-next-app bootstrap), Vercel Platform Deployment

### Community 99 - "CuentasPorPagarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 100 - "integrations/page.tsx"
Cohesion: 0.48
Nodes (4): Tabs(), TabsContent(), TabsList(), TabsTrigger()

### Community 103 - "cn"
Cohesion: 0.06
Nodes (36): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList() (+28 more)

### Community 113 - "dependencies"
Cohesion: 0.18
Nodes (11): jspdf-autotable, dependencies, jspdf, jspdf-autotable, react, react-dom, xlsx, jspdf (+3 more)

### Community 114 - "devDependencies"
Cohesion: 0.18
Nodes (11): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react (+3 more)

### Community 116 - "package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 117 - "app/package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 119 - "alegra-design.skill"
Cohesion: 0.22
Nodes (8): ������a�0r�40r.�|F>#����`�30�Y�, C���d#���2C?q�t8��`���έ�E��F�ql���`x���{����������ۜSv$�~�]�P.��2], "-!���E~"�sJ6O�WX+_\Z, %����Qw�]��P��c)�]t�aL��1�Ku)⌉��, ��Sa�4����|4�I�_���a��0Ԧ�>��/Ƣ���m�wg��������W��}��a��Yȅ�<o۸i�, t ���I]=��ա���H��ɤ�'u�tRϑA�<D?#��2���, �y�A��>�.�wy=g՘�g��!�]k֔:�,g�ڼ�����%r��l����, _Z�T���C++l�g�8Җ�	�Dm�	>���"BE4PQ]�Z���B�"h�Õf�Cc8ݳt5lOǻaK�0��,?��]ö$k˔U���{	�vn

### Community 120 - "initialBudget.js"
Cohesion: 0.36
Nodes (5): DynamicList(), TransportForm(), addMonthsIso(), makeId(), createInitialBudget()

### Community 122 - "Component Patterns"
Cohesion: 0.22
Nodes (9): Badge / Chip, Button, Card, Component Patterns, Extracted Components, Input, Modal / Dialog, Navigation (+1 more)

### Community 123 - "dependencies"
Cohesion: 0.06
Nodes (31): axios, cmdk, geist, laravel-echo, next-themes, dependencies, axios, cmdk (+23 more)

### Community 125 - "cotizaciones/page.tsx"
Cohesion: 0.31
Nodes (6): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuotePageHeader(), useQuotesList()

### Community 129 - ".oxlintrc.json"
Cohesion: 0.25
Nodes (7): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, warn

### Community 136 - "remissions/page.tsx"
Cohesion: 0.29
Nodes (6): FacturasVentaViewProps, RemissionsPage(), RemissionPageHeader(), RemissionTable(), getColumns(), useRemissionsList()

### Community 137 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 140 - "UserInfoPanel.tsx"
Cohesion: 0.13
Nodes (30): RolesPage(), getInitials(), UsersPage(), CreateUserModal(), UserInfoPanel(), UserInfoPanelProps, useRolesList(), usePermissions() (+22 more)

### Community 141 - "10. Agent Prompt Guide"
Cohesion: 0.29
Nodes (7): 10. Agent Prompt Guide, Build a Button, Build a Card, Build a Form, Build a Page Layout, Build a Stats Card, General Component

### Community 144 - "MonthSelector.tsx"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 145 - "CuentasPorCobrarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 148 - "4. Component Stylings"
Cohesion: 0.29
Nodes (7): 4. Component Stylings, Data Display (3), Data Input (1), Layout (1), Media (2), Navigation (1), Overlay (1)

### Community 153 - "Spacing & Layout"
Cohesion: 0.29
Nodes (7): Base Grid: 5px, Border Radius, Breakpoints, Container, Spacing as Meaning, Spacing & Layout, Spacing Scale

### Community 155 - "debounced-input.tsx"
Cohesion: 0.33
Nodes (5): FilterOption, paymentFilterOptions, PaymentTableToolbarProps, DebouncedInput(), DebouncedInputProps

### Community 156 - "SummaryPanel.jsx"
Cohesion: 0.53
Nodes (4): CATEGORY_COLORS, DonutChart(), SummaryPanel(), formatCurrency()

### Community 161 - "6. Depth & Elevation"
Cohesion: 0.33
Nodes (6): 6. Depth & Elevation, Flat — subtle depth hints, Floating — dropdowns, popovers, modals, Overlay — full-screen overlays, top-level dialogs, Raised — cards, buttons, interactive elements, Z-Index Scale

### Community 162 - "Color System"
Cohesion: 0.40
Nodes (5): Color System, Core Palette, CSS Variable Tokens, Extended Palette, Status Colors

### Community 170 - "Typography"
Cohesion: 0.40
Nodes (5): Font Sources, Font Stack, Type Scale, Typography, Typography Rules

### Community 171 - "invoices/page.tsx"
Cohesion: 0.50
Nodes (4): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), useInvoicesList()

### Community 174 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 189 - "7. Animation & Motion"
Cohesion: 0.50
Nodes (4): 7. Animation & Motion, Animated Components, CSS Animations, Motion Guidelines

### Community 192 - "Animation & Motion"
Cohesion: 0.50
Nodes (4): Animation & Motion, CSS Animations, Motion Guidelines, Motion Tokens

### Community 193 - "BaseItemBasicInfo"
Cohesion: 0.50
Nodes (4): BaseItemBasicInfo, ComboBasicInfo, ProductBasicInfo, ServiceBasicInfo

## Knowledge Gaps
- **797 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+792 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **74 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `table.tsx`, `.oxlintrc.json`, `ContactAdvancedForm.tsx`, `dialog.tsx`, `types/auth.ts`, `NewInvoiceMain.tsx`, `users/page.tsx`, `CostCenterTable.tsx`, `remissions/page.tsx`, `alert.tsx`, `QuoteTable.tsx`, `sidebar.tsx`, `dashboard/page.tsx`, `remissions/new/page.tsx`, `button.tsx`, `UserInfoPanel.tsx`, `MonthSelector.tsx`, `useNotifications.ts`, `cn`, `NewQuoteSettingsDrawer.tsx`, `returns/[id]/page.tsx`, `ReturnsTable.tsx`, `TwoFactorPanel.tsx`, `NewReminderModal.tsx`, `showToast`, `debounced-input.tsx`, `ReturnDetailDocument.tsx`, `lib/utils.ts`, `invoices/new/page.tsx`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `ContactTable.tsx`, `DeleteWidgetDialog.tsx`, `ItemResponse`, `NewPurchaseOrderForm.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `invoices/page.tsx`, `PaymentTable.tsx`, `tooltip.tsx`, `quotes/[id]/page.tsx`, `tasks/page.tsx`, `ItemTable.tsx`, `Header.tsx`, `useRoleMutations.ts`, `carousel.tsx`, `navigation-menu.tsx`, `InvoiceTable.tsx`, `CompanySummaryCard.tsx`, `ItemDocumentsTab.tsx`, `ResolutionForm.tsx`, `menubar.tsx`, `items/[id]/page.tsx`, `contacts/[id]/page.tsx`, `calculations.js`, `auth-context.tsx`, `ui/utils.ts`, `ReportsSections.tsx`, `NewReturnForm.tsx`, `App.jsx`, `chart.tsx`, `extractErrorMessage`, `ImpuestosWidget.tsx`, `input.tsx`, `pagination.tsx`, `formatCurrency`, `useInvoices.ts`, `[filename]/page.tsx`, `AddGraphMenu.tsx`, `useResolutions`, `integrations/page.tsx`, `invoice/InvoiceItemsTable.tsx`, `cn`, `cotizaciones/page.tsx`?**
  _High betweenness centrality (0.311) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `ContactAdvancedForm.tsx`, `dialog.tsx`, `types/auth.ts`, `NewInvoiceMain.tsx`, `users/page.tsx`, `remissions/page.tsx`, `dashboard/page.tsx`, `remissions/new/page.tsx`, `button.tsx`, `UserInfoPanel.tsx`, `useNotifications.ts`, `cn`, `NewQuoteSettingsDrawer.tsx`, `returns/[id]/page.tsx`, `TwoFactorPanel.tsx`, `NewReminderModal.tsx`, `lib/utils.ts`, `invoices/new/page.tsx`, `InvoicesService`, `quote.ts`, `invoices/[id]/page.tsx`, `ContactTable.tsx`, `NewPurchaseOrderForm.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `ApiResponse`, `useRoleMutations.ts`, `PaymentTable.tsx`, `tooltip.tsx`, `quotes/[id]/page.tsx`, `resolveStockFields`, `ResolutionForm.tsx`, `contacts/[id]/page.tsx`, `auth-context.tsx`, `NewReturnForm.tsx`, `extractErrorMessage`, `input.tsx`, `useCatalogs`, `react`, `useResolutions`, `cotizaciones/page.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `dialog.tsx`, `NewInvoiceMain.tsx`, `users/page.tsx`, `sidebar.tsx`, `alert.tsx`, `button.tsx`, `cn`, `TwoFactorPanel.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `Header.tsx`, `carousel.tsx`, `navigation-menu.tsx`, `ResolutionForm.tsx`, `menubar.tsx`, `ui/utils.ts`, `chart.tsx`, `input.tsx`, `pagination.tsx`, `react`, `integrations/page.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _797 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContactAdvancedForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1354723707664884 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06912280701754386 - nodes in this community are weakly interconnected._
- **Should `types/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._