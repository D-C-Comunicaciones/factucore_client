# Graph Report - facturacion-cliente  (2026-08-18)

## Corpus Check
- 545 files · ~296,993 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2516 nodes · 7510 edges · 206 communities (122 shown, 84 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21bd8734`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- ContactAdvancedForm.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- invoice/table/columns.tsx
- CostCenterTable.tsx
- cn
- remissions/new/page.tsx
- QuoteTable.tsx
- react
- dashboard/page.tsx
- useRemissions.ts
- button.tsx
- devDependencies
- useNotifications.ts
- compilerOptions
- cn
- types/items.ts
- QuickCreateItemModal.tsx
- components.json
- CreditNotesService
- debounced-input.tsx
- UserInfoPanel.tsx
- CommentsAndReminders.tsx
- lib/items.ts
- useQuotes.ts
- FactucoreLogo.tsx
- CustomToaster.tsx
- quotes/[id]/edit/page.tsx
- InvoicesService
- quote.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- contacts/page.tsx
- ItemResponse
- invoice.ts
- expenses/purchase-orders/new/page.tsx
- errors.ts
- IntegrationsService
- Órdenes de compra (`purchase_orders`) — CRUD y guía de integración
- ApiResponse
- drawer.tsx
- PaymentTable.tsx
- tooltip.tsx
- quotes/[id]/page.tsx
- tasks/page.tsx
- ItemTable.tsx
- AuthService
- useCompanyProfile.ts
- carousel.tsx
- navigation-menu.tsx
- InvoiceTable.tsx
- CompanySummaryCard.tsx
- ItemDocumentsTab.tsx
- ExportItemsModal.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- items/[id]/page.tsx
- Sidebar.tsx
- InvoiceFilter.tsx
- auth-context.tsx
- ui/utils.ts
- remission.ts
- exports.md Reference Guide
- ReportsSections.tsx
- PersonalDataSection.tsx
- toggle-group.tsx
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales
- input.tsx
- pagination.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- showToast
- returns/[id]/page.tsx
- PaymentInvoicesList.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- useDevices.ts
- Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona
- NewSoftwareModal.tsx
- quotes.ts
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- useResolutions
- ItemDetailView.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- lucide-react
- pusher-js
- CuentasPorPagarWidget.tsx
- [role]/page.tsx
- invoice/InvoiceItemsTable.tsx
- context-menu.tsx
- @radix-ui/react-accordion
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- @radix-ui/react-dialog
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- @radix-ui/react-dropdown-menu
- RemissionDetailHeader.tsx
- @radix-ui/react-menubar
- geist
- dependencies
- @dnd-kit/modifiers
- invoices/new/page.tsx
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- @radix-ui/react-slot
- next
- react-hook-form
- radix-ui
- alert.tsx
- clsx
- @radix-ui/react-checkbox
- users/page.tsx
- Header.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- jspdf
- @radix-ui/react-tabs
- laravel-echo
- @radix-ui/react-toggle-group
- @radix-ui/react-toggle
- postcss
- react-dom
- react-qr-code
- react-resizable-panels
- @radix-ui/react-alert-dialog
- sonner
- @radix-ui/react-aspect-ratio
- tailwind-merge
- @radix-ui/react-avatar
- @tanstack/query-sync-storage-persister
- NewInvoiceView.tsx
- @tanstack/react-query-persist-client
- DeleteWidgetDialog.tsx
- vaul
- @radix-ui/react-context-menu
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
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
- DevolucionesWidget.tsx
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @tabler/icons-react
- class-variance-authority
- ImpuestosWidget.tsx
- ProductosVendidosSimpleWidget.tsx
- react-day-picker
- WidgetSkeleton.tsx
- recharts
- tailwindcss-animate
- @tanstack/react-query
- zod
- NewCertificateModal.tsx
- date-fns

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 219 edges
2. `cn()` - 198 edges
3. `cn()` - 141 edges
4. `react` - 118 edges
5. `Button()` - 113 edges
6. `useCatalogs()` - 55 edges
7. `DialogContent()` - 52 edges
8. `DialogTitle()` - 52 edges
9. `Dialog()` - 51 edges
10. `TooltipContent()` - 51 edges

## Surprising Connections (you probably didn't know these)
- `CertificatesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/certificates/page.tsx → package.json
- `SoftwarePage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/software/page.tsx → package.json
- `ContactPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/contacts/page.tsx → package.json
- `QuotesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/cotizaciones/page.tsx → package.json
- `InternalPurchaseOrdersPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/expenses/purchase-orders/page.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (206 total, 84 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.26
Nodes (14): CertificateListProps, ContactTableBodyProps, ReturnRow(), ReturnsTableBodyProps, SoftwareListProps, Table(), TableBody(), TableCaption() (+6 more)

### Community 1 - "ContactAdvancedForm.tsx"
Cohesion: 0.12
Nodes (23): NewContactContent(), AddContactModal(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps (+15 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.09
Nodes (33): ConfigCostCentersModalProps, DOCUMENT_TYPES, CreateCurrencyModalProps, ProductGalleryModalProps, CreateWarehouseModalProps, ProductComboModalProps, VariantGalleryModalProps, NewPaymentTermModalProps (+25 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.11
Nodes (23): ConfirmEmailContent(), PasswordGateDialog(), PasswordGateDialogProps, useVerifyPassword(), AuthFlowService, ConfirmEmailPayload, DeviceSession, ForgotPasswordResponse (+15 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.12
Nodes (41): ContactAccountingInfoProps, ContactCommercialInfoProps, EditResolutionModal(), InvoiceItemsTable(), ItemRow(), NewPaymentTermModal(), ItemRow(), ItemRow() (+33 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.17
Nodes (19): NewCertificateFormProps, InvoiceDetailHeaderProps, contactLabel(), PurchaseOrderDetailView(), contactLabel(), InternalPurchaseOrderDetailView(), ActionsCell(), PurchaseOrderStatusBadge() (+11 more)

### Community 7 - "CostCenterTable.tsx"
Cohesion: 0.11
Nodes (21): CostCentersPage(), ConfigCostCentersModal(), CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter() (+13 more)

### Community 8 - "cn"
Cohesion: 0.06
Nodes (53): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList() (+45 more)

### Community 9 - "remissions/new/page.tsx"
Cohesion: 0.16
Nodes (15): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewRemissionFooter(), NewRemissionHeader(), NewRemissionHeaderProps, NewRemissionSettingsDrawer(), GlobalAdjustment (+7 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.12
Nodes (22): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), defaultFilterOptions, QuoteFilter(), QuotePageHeader(), QuoteTable() (+14 more)

### Community 11 - "react"
Cohesion: 0.11
Nodes (16): react, react, FormattedInput(), FormattedInput(), FormattedInput(), ItemAccounting(), FormattedInput(), FormattedInput() (+8 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.15
Nodes (18): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, FlujoTransaccionesWidget(), TotalVentasWidget(), clientesConVentasMock (+10 more)

### Community 13 - "useRemissions.ts"
Cohesion: 0.11
Nodes (17): RemissionDetailPage(), RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps, REMISSION_KEY() (+9 more)

### Community 14 - "button.tsx"
Cohesion: 0.10
Nodes (30): ContactDetailHeaderProps, ContactComments(), CostCenterFilterProps, FilterOption, InvoicePageHeaderProps, StatusToggle(), PaymentDetailHeaderProps, QuoteDetailHeaderProps (+22 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (32): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+24 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.08
Nodes (25): metadata, DOCUMENT_ROUTES, NotificationBell(), timeAgo(), CustomToaster(), ThemeProvider(), getChannelName(), LIST_KEY() (+17 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "cn"
Cohesion: 0.16
Nodes (23): ItemImage, CustomFieldModal(), CustomFieldModalProps, FALLBACK_FIELD_TYPES, AdditionalFieldsSection(), CustomFieldDatePicker(), CreateWarehouseModal(), ImageUploader() (+15 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "QuickCreateItemModal.tsx"
Cohesion: 0.10
Nodes (37): CategoryModalProps, NewCategoryModal(), CostCenter, NewCostCenterModal(), NewCostCenterModalProps, NewCurrencyModal(), BLANK_BASIC, QuickCreateItemModal() (+29 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.11
Nodes (12): ReturnDetailPage(), NewReturnForm(), createEmptyLine(), NewReturnForm(), usePrefetchInvoiceDetail(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, extractCreditNote() (+4 more)

### Community 23 - "debounced-input.tsx"
Cohesion: 0.15
Nodes (12): ReturnsPage(), ReturnPageHeader(), ReturnsTable(), ReturnsTableProps, ReturnsTableBody(), ReturnsTablePagination(), ReturnsTablePaginationProps, ReturnsTableToolbar() (+4 more)

### Community 24 - "UserInfoPanel.tsx"
Cohesion: 0.21
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), UserInfoPanelProps (+1 more)

### Community 25 - "CommentsAndReminders.tsx"
Cohesion: 0.07
Nodes (40): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader() (+32 more)

### Community 26 - "lib/items.ts"
Cohesion: 0.15
Nodes (13): EditItemPage(), NewItemFormProps, UseItemsParams, useItemById(), ToggleStatusParams, useUpdateItem(), itemsApi, PaginatedData (+5 more)

### Community 27 - "useQuotes.ts"
Cohesion: 0.18
Nodes (9): QuoteDetailPage(), INVOICE_KEY(), INVOICES_KEY, useCreateQuote(), usePrefetchQuoteDetail(), useSendQuote(), useUpdateQuote(), QuotesService (+1 more)

### Community 28 - "FactucoreLogo.tsx"
Cohesion: 0.20
Nodes (10): FactucoreLogo(), FactucoreLogoProps, InvoiceDetailDocumentProps, DianStatusBadge(), QuoteDetailDocumentProps, RemissionDetailDocumentProps, CompanyData, CompanyHeaderPdfStyle() (+2 more)

### Community 29 - "CustomToaster.tsx"
Cohesion: 0.13
Nodes (15): AttributeModal(), AttributeModalProps, ComboProductEntry, PriceListEntry, WarehouseEntry, ComboProductData, ProductComboModal(), VariantGalleryModal() (+7 more)

### Community 30 - "quotes/[id]/edit/page.tsx"
Cohesion: 0.16
Nodes (16): parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewInvoiceOptions(), PreviewModal(), PreviewModalProps, NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps (+8 more)

### Community 31 - "InvoicesService"
Cohesion: 0.18
Nodes (4): InvoiceDetailPage(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "quote.ts"
Cohesion: 0.12
Nodes (16): AllowanceCharge, QuoteBill, QuoteBillingPeriod, QuoteCompany, QuoteCustomer, QuoteDetailResponse, QuoteDian, QuoteEstablishment (+8 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.11
Nodes (14): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+6 more)

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.12
Nodes (21): defaultFilterOptions, RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips(), FilterChipsProps (+13 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.11
Nodes (22): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+14 more)

### Community 36 - "ItemResponse"
Cohesion: 0.18
Nodes (10): TabConfig, ItemHeaderProps, InfoChip(), ItemMainInfo(), ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ProductGalleryModal() (+2 more)

### Community 37 - "invoice.ts"
Cohesion: 0.11
Nodes (23): InvoiceEditPage(), extractInvoiceFromDetail(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), useUpdateInvoice(), AllowanceCharge, DianSubmissionStatus (+15 more)

### Community 38 - "expenses/purchase-orders/new/page.tsx"
Cohesion: 0.06
Nodes (48): EditInternalPurchaseOrderPage(), toDateInput(), InternalPurchaseOrderDetailPage(), NewInternalPurchaseOrderPage(), InternalPurchaseOrdersPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), PurchaseOrdersPage() (+40 more)

### Community 39 - "errors.ts"
Cohesion: 0.16
Nodes (12): ActivateAccountContent(), ForgotPasswordPage(), ResetPasswordContent(), AuthLinkStatus(), AuthLinkStatusProps, InvoiceStats, StatCard(), StatCardProps (+4 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.10
Nodes (19): ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), CreateWebhookModalProps, RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal() (+11 more)

### Community 41 - "Órdenes de compra (`purchase_orders`) — CRUD y guía de integración"
Cohesion: 0.14
Nodes (13): 1. Crear orden de compra, 2. Listar órdenes de compra, 3. Detalle de una orden de compra, 4. Editar orden de compra, 5. Eliminar orden de compra, `allowance_charges[]` (a nivel de línea o global, mismo shape), Body de cada línea en `items[]`, Ejemplo — `external` (orden del cliente) (+5 more)

### Community 42 - "ApiResponse"
Cohesion: 0.09
Nodes (12): CONTACTS_KEY, ApiClient, AttributePayload, attributesApi, categoriesApi, currenciesApi, PaymentTermsService, priceListsApi (+4 more)

### Community 43 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.05
Nodes (38): PaymentDetailPage(), PaymentsPage(), PaymentDetailAccounting(), PaymentDetailAdvances(), Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader() (+30 more)

### Community 45 - "tooltip.tsx"
Cohesion: 0.12
Nodes (22): ContactBasicFormProps, ContactSidebarProps, FlujoTransaccionesData, FlujoTransaccionesWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, GeneralInfoSectionProps (+14 more)

### Community 46 - "quotes/[id]/page.tsx"
Cohesion: 0.19
Nodes (8): QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps, CommentsAndReminders()

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.11
Nodes (20): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels, ItemFilterChips(), ItemFilterChipsProps (+12 more)

### Community 49 - "AuthService"
Cohesion: 0.22
Nodes (5): AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, AuthService

### Community 50 - "useCompanyProfile.ts"
Cohesion: 0.33
Nodes (6): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.10
Nodes (24): FacturasVentaViewProps, InvoicesPage(), defaultFilterOptions, InvoicePageHeader(), InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns() (+16 more)

### Community 54 - "CompanySummaryCard.tsx"
Cohesion: 0.31
Nodes (5): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid()

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "ExportItemsModal.tsx"
Cohesion: 0.13
Nodes (19): ContactDetailGeneral(), ContactDetailGeneralProps, ExportConfig, ExportItemsModal(), ExportItemsModalProps, FormControl(), FormDescription(), FormField() (+11 more)

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
Cohesion: 0.23
Nodes (7): ItemDetailPage(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemInventoryProps, useDeleteItem(), useToggleItemStatus()

### Community 61 - "Sidebar.tsx"
Cohesion: 0.18
Nodes (12): Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem, SidebarMenuItems() (+4 more)

### Community 62 - "InvoiceFilter.tsx"
Cohesion: 0.25
Nodes (7): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, FilterOption, InvoiceFilter(), InvoiceFilterProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.14
Nodes (16): CompanyProfilePage(), AuthenticatedLayout(), LoginPage(), RootPage(), TwoFactorChallengeForm(), UserMenu(), UserMenuProps, AuthContext (+8 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.10
Nodes (9): AccordionContent(), AccordionItem(), AccordionTrigger(), HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Slider() (+1 more)

### Community 65 - "remission.ts"
Cohesion: 0.10
Nodes (18): FacturasVentaViewProps, RemissionsPage(), RemissionPageHeader(), useRemissionsList(), AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany (+10 more)

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "PersonalDataSection.tsx"
Cohesion: 0.29
Nodes (9): SecurityPage(), getInitials(), isTenantProfile(), PersonalDataSection(), TwoFactorSection(), Skeleton(), useProfile(), useUpdateProfile() (+1 more)

### Community 69 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.12
Nodes (18): ChangePasswordDialog(), RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanel() (+10 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales"
Cohesion: 0.22
Nodes (8): Contrato de API actualizado, Edición (`PATCH /purchase-orders/{id}`), La respuesta ahora trae totales reales, Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales, Qué hay que agregar al formulario de items, Recapitulación: dos tipos de orden de compra (sigue igual), Resumen de lo que hay que construir/ajustar, Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

### Community 74 - "input.tsx"
Cohesion: 0.11
Nodes (23): PasswordResetForm(), PasswordResetFormProps, TwoFactorChallengeFormProps, ChangeEmailDialog(), ChangeEmailDialogProps, ChangePasswordDialogProps, Field(), FieldContent() (+15 more)

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

### Community 79 - "showToast"
Cohesion: 0.14
Nodes (20): EditContactContent(), NewItemPage(), FormState, ItemsPage(), NewPaymentPageContent(), ResolutionsPage(), NewInvoiceComments(), NewInvoiceMain() (+12 more)

### Community 80 - "returns/[id]/page.tsx"
Cohesion: 0.17
Nodes (13): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailDocument(), ReturnDetailDocumentProps, ReturnDetailHeader(), ReturnDetailSkeleton() (+5 more)

### Community 81 - "PaymentInvoicesList.tsx"
Cohesion: 0.40
Nodes (5): parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps, WithholdingEntry, PopoverAnchor()

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "useDevices.ts"
Cohesion: 0.40
Nodes (3): ConnectedDevicesSection(), formatRelativeTime(), useDevices()

### Community 86 - "Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona"
Cohesion: 0.29
Nodes (6): Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona, Contexto, Ejemplo de polling (pseudocódigo, adaptar al stack del frontend), Qué debe hacer el frontend, Qué NO cambia, Qué se rompe con el flujo actual

### Community 87 - "NewSoftwareModal.tsx"
Cohesion: 0.22
Nodes (6): SoftwarePage(), NewSoftwareForm(), NewSoftwareModal(), NewSoftwareModalProps, SoftwareList(), softwaresApi

### Community 88 - "quotes.ts"
Cohesion: 0.15
Nodes (9): DOCUMENT_TYPES, DocumentType, envs, DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), QuoteFindAllSuccess (+1 more)

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "useResolutions"
Cohesion: 0.12
Nodes (22): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, NewInvoicePayment(), ResolutionForm(), ResolutionFormProps, ResolutionTable(), ResolutionTableProps (+14 more)

### Community 92 - "ItemDetailView.tsx"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

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

### Community 100 - "[role]/page.tsx"
Cohesion: 0.15
Nodes (18): MODULES, PermissionGroupCard(), RolePermissionsPage(), Tabs(), TabsContent(), TabsList(), TabsTrigger(), ACCESS_LABEL (+10 more)

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 120 - "RemissionDetailHeader.tsx"
Cohesion: 0.40
Nodes (5): RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge()

### Community 123 - "dependencies"
Cohesion: 0.13
Nodes (15): axios, cmdk, @dnd-kit/core, @dnd-kit/sortable, dependencies, axios, cmdk, @dnd-kit/core (+7 more)

### Community 125 - "invoices/new/page.tsx"
Cohesion: 0.16
Nodes (18): NewInvoicePageContent(), EditQuotePage(), NewQuotePageContent(), NewRemissionPageContent(), getSession(), SessionData, NewInvoiceFooter(), NewInvoiceHeader() (+10 more)

### Community 137 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 140 - "users/page.tsx"
Cohesion: 0.60
Nodes (4): getInitials(), UsersPage(), VALID_ROLES, UserInfoPanel()

### Community 141 - "Header.tsx"
Cohesion: 0.15
Nodes (18): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog() (+10 more)

### Community 144 - "MonthSelector.tsx"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 145 - "CuentasPorCobrarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 206 - "NewCertificateModal.tsx"
Cohesion: 0.22
Nodes (6): CertificatesPage(), CertificateList(), NewCertificateForm(), NewCertificateModal(), NewCertificateModalProps, certificatesApi

## Knowledge Gaps
- **618 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+613 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **84 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `showToast()` connect `showToast` to `ContactAdvancedForm.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `invoice/table/columns.tsx`, `CostCenterTable.tsx`, `remissions/new/page.tsx`, `QuoteTable.tsx`, `react`, `dashboard/page.tsx`, `useRemissions.ts`, `button.tsx`, `useNotifications.ts`, `cn`, `QuickCreateItemModal.tsx`, `CreditNotesService`, `CommentsAndReminders.tsx`, `lib/items.ts`, `useQuotes.ts`, `CustomToaster.tsx`, `quotes/[id]/edit/page.tsx`, `InvoicesService`, `invoices/[id]/page.tsx`, `expenses/purchase-orders/new/page.tsx`, `errors.ts`, `IntegrationsService`, `PaymentTable.tsx`, `tooltip.tsx`, `quotes/[id]/page.tsx`, `useCompanyProfile.ts`, `items/[id]/page.tsx`, `Sidebar.tsx`, `auth-context.tsx`, `remission.ts`, `PersonalDataSection.tsx`, `TwoFactorPanel.tsx`, `input.tsx`, `NewCertificateModal.tsx`, `returns/[id]/page.tsx`, `PaymentInvoicesList.tsx`, `NewSoftwareModal.tsx`, `useResolutions`, `RemissionDetailHeader.tsx`, `invoices/new/page.tsx`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dialog.tsx`, `NewRemissionMain.tsx`, `invoice/table/columns.tsx`, `CostCenterTable.tsx`, `cn`, `QuoteTable.tsx`, `cn`, `QuickCreateItemModal.tsx`, `debounced-input.tsx`, `CustomToaster.tsx`, `quotes/[id]/edit/page.tsx`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `contacts/page.tsx`, `ItemResponse`, `expenses/purchase-orders/new/page.tsx`, `PaymentTable.tsx`, `tooltip.tsx`, `ItemTable.tsx`, `carousel.tsx`, `InvoiceTable.tsx`, `ItemDocumentsTab.tsx`, `ExportItemsModal.tsx`, `items/[id]/page.tsx`, `Sidebar.tsx`, `ui/utils.ts`, `remission.ts`, `toggle-group.tsx`, `chart.tsx`, `input.tsx`, `NewCertificateModal.tsx`, `showToast`, `NewSoftwareModal.tsx`, `useResolutions`, `ItemDetailView.tsx`, `RemissionDetailHeader.tsx`, `dependencies`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `next-themes`, `@hookform/resolvers`, `html2canvas`, `input-otp`, `@radix-ui/react-slot`, `next`, `react-hook-form`, `radix-ui`, `clsx`, `@radix-ui/react-checkbox`, `react`, `@radix-ui/react-label`, `devDependencies`, `@radix-ui/react-progress`, `jspdf`, `@radix-ui/react-tabs`, `laravel-echo`, `@radix-ui/react-toggle-group`, `@radix-ui/react-toggle`, `postcss`, `react-dom`, `react-qr-code`, `react-resizable-panels`, `@radix-ui/react-alert-dialog`, `sonner`, `@radix-ui/react-aspect-ratio`, `tailwind-merge`, `@radix-ui/react-avatar`, `@tanstack/query-sync-storage-persister`, `@tanstack/react-query-persist-client`, `vaul`, `@radix-ui/react-context-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@tabler/icons-react`, `class-variance-authority`, `react-day-picker`, `recharts`, `tailwindcss-animate`, `@tanstack/react-query`, `zod`, `date-fns`, `lucide-react`, `pusher-js`, `@radix-ui/react-accordion`, `@radix-ui/react-dialog`, `dayjs`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-menubar`, `geist`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`, `embla-carousel-react`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _618 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ContactAdvancedForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12100840336134454 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08581349206349206 - nodes in this community are weakly interconnected._
- **Should `types/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11363636363636363 - nodes in this community are weakly interconnected._