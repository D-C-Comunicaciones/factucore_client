# Graph Report - facturacion-cliente  (2026-08-17)

## Corpus Check
- 539 files · ~291,760 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2460 nodes · 7365 edges · 211 communities (128 shown, 83 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c89cb65`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- tooltip.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- NewRemissionMain.tsx
- invoice/table/columns.tsx
- PaymentsService
- sidebar.tsx
- invoices/new/page.tsx
- quote.ts
- ApiClient
- dashboard/page.tsx
- AuthService
- dropdown-menu.tsx
- devDependencies
- useNotifications.ts
- compilerOptions
- QuickCreateItemModal.tsx
- types/items.ts
- NewQuoteSettingsDrawer.tsx
- components.json
- returns/[id]/page.tsx
- debounced-input.tsx
- CostCenterTable.tsx
- lib/utils.ts
- lib/items.ts
- contacts/[id]/page.tsx
- Comentarios con @mentions + Notificaciones en tiempo real
- cn
- quotes/[id]/edit/page.tsx
- InvoicesService
- useQuotes.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- contacts/page.tsx
- items/page.tsx
- invoice.ts
- usePurchaseOrders.ts
- activate-account/page.tsx
- IntegrationsService
- payments/[id]/page.tsx
- showToast
- cn
- PaymentTable.tsx
- ContactAdvancedForm.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- searchable-select.tsx
- CompanyProfileForm.tsx
- carousel.tsx
- axios
- InvoiceTable.tsx
- ApiResponse
- ItemDocumentsTab.tsx
- form.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- extractErrorMessage
- Sidebar.tsx
- PaymentDetailTabs.tsx
- auth-context.tsx
- ui/utils.ts
- remission.ts
- exports.md Reference Guide
- ReportsSections.tsx
- ProfileService
- NewReturnForm.tsx
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales
- field.tsx
- ItemDetailView.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- remissions/[id]/page.tsx
- ReturnsTableBody.tsx
- EmptyDashboardState.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- software/page.tsx
- CompanySummaryCard.tsx
- button.tsx
- api-client.ts
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- Resolution
- CustomToaster.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- [role]/page.tsx
- invoice/InvoiceItemsTable.tsx
- context-menu.tsx
- ImpuestosWidget.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- alert.tsx
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- QuoteItemsTable.tsx
- DeleteWidgetDialog.tsx
- PersonalDataSection.tsx
- geist
- dependencies
- @dnd-kit/modifiers
- useCatalogs
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- DevolucionesWidget.tsx
- next
- react-hook-form
- radix-ui
- ProductosVendidosSimpleWidget.tsx
- clsx
- @radix-ui/react-checkbox
- WidgetSkeleton.tsx
- Header.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- lucide-react
- pusher-js
- jspdf
- @radix-ui/react-tabs
- laravel-echo
- @radix-ui/react-toggle-group
- @radix-ui/react-accordion
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
- @radix-ui/react-dialog
- @tanstack/react-query-persist-client
- @radix-ui/react-dropdown-menu
- vaul
- @radix-ui/react-context-menu
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- @radix-ui/react-menubar
- @radix-ui/react-hover-card
- @radix-ui/react-navigation-menu
- @radix-ui/react-radio-group
- @radix-ui/react-slot
- @radix-ui/react-select
- @radix-ui/react-toggle
- @radix-ui/react-separator
- @radix-ui/react-slider
- @radix-ui/react-switch
- @tabler/icons-react
- class-variance-authority
- react-day-picker
- recharts
- PaymentFilterChips.tsx
- @tanstack/react-query
- zod
- ItemResponse
- payments/page.tsx
- PaymentInvoicesList.tsx
- RemissionDetailHeader.tsx
- ReturnsTableToolbar.tsx
- certificates/page.tsx
- ItemTableToolbar.tsx
- PaymentDetailInfo.tsx
- date-fns
- DashboardPage

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 214 edges
2. `cn()` - 198 edges
3. `cn()` - 141 edges
4. `react` - 119 edges
5. `Button()` - 112 edges
6. `useCatalogs()` - 55 edges
7. `ApiResponse` - 55 edges
8. `DialogContent()` - 52 edges
9. `DialogTitle()` - 52 edges
10. `Dialog()` - 51 edges

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

## Communities (211 total, 83 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.19
Nodes (21): FactucoreLogo(), FactucoreLogoProps, CertificateListProps, ContactTableBodyProps, InvoiceDetailDocumentProps, DianStatusBadge(), QuoteDetailDocumentProps, RemissionDetailDocumentProps (+13 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.14
Nodes (16): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, ProductoItem, ProductosMasVendidosWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, GeneralInfoSectionProps (+8 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.12
Nodes (22): NewCertificateModalProps, CreateCurrencyModalProps, ProductGalleryModalProps, CreateWarehouseModalProps, ProductComboModalProps, NewPaymentTermModalProps, PaymentTabs(), ChangeClientModalProps (+14 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.14
Nodes (18): PasswordGateDialog(), PasswordGateDialogProps, useVerifyPassword(), ChangePasswordPayload, ConfirmEmailPayload, DeviceSession, ForgotPasswordResponse, LoginRequires2FA (+10 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "NewRemissionMain.tsx"
Cohesion: 0.22
Nodes (17): AddContactModal(), ContactAccountingInfoProps, ContactCommercialInfoProps, CustomFieldModalProps, FALLBACK_FIELD_TYPES, NewPaymentTermModal(), QuoteExportModalProps, RemissionExportModalProps (+9 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.18
Nodes (17): NewCertificateFormProps, InvoiceDetailHeaderProps, contactLabel(), PurchaseOrderDetailView(), contactLabel(), InternalPurchaseOrderDetailView(), PurchaseOrderStatusBadge(), NewSoftwareFormProps (+9 more)

### Community 7 - "PaymentsService"
Cohesion: 0.28
Nodes (4): PaymentDetailPage(), NewPaymentPage(), usePayment(), PaymentsService

### Community 8 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

### Community 9 - "invoices/new/page.tsx"
Cohesion: 0.10
Nodes (32): NewInvoicePage(), EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewRemissionPage(), NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps (+24 more)

### Community 10 - "quote.ts"
Cohesion: 0.06
Nodes (38): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuoteFilter(), QuotePageHeader(), QuoteTable(), QuoteTableProps (+30 more)

### Community 11 - "ApiClient"
Cohesion: 0.09
Nodes (9): CONTACTS_KEY, ApiClient, AttributePayload, attributesApi, categoriesApi, currenciesApi, priceListsApi, CreateSoftwarePayload (+1 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.12
Nodes (21): PREDEFINED_POSITIONS, SortableWidgetProps, Widget, ClientesConVentasWidget(), ClientesConVentasWidgetProps, DistribucionGastosWidget(), FlujoTransaccionesWidget(), MejoresClientesWidget() (+13 more)

### Community 13 - "AuthService"
Cohesion: 0.17
Nodes (7): AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), AuthService, AuthBootstrap()

### Community 14 - "dropdown-menu.tsx"
Cohesion: 0.07
Nodes (44): ContactDetailHeaderProps, CostCenterFilterProps, defaultCostCenterFilterOptions, FilterOption, FilterChipsProps, filterIcons, filterLabels, defaultFilterOptions (+36 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (32): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+24 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.15
Nodes (17): DOCUMENT_ROUTES, NotificationBell(), timeAgo(), getChannelName(), LIST_KEY(), UNREAD_COUNT_KEY, useMarkAllNotificationsRead(), useMarkNotificationRead() (+9 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "QuickCreateItemModal.tsx"
Cohesion: 0.10
Nodes (30): NewItemPage(), CategoryModalProps, NewCategoryModal(), CustomFieldModal(), BLANK_BASIC, QuickCreateItemModal(), QuickCreateItemModalProps, AdditionalFieldsSection() (+22 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.19
Nodes (16): CostCenter, NewCostCenterModal(), NewCostCenterModalProps, NewCurrencyModal(), NewPriceListModal(), NewPriceListModalProps, FixedFields, FixedFields (+8 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "returns/[id]/page.tsx"
Cohesion: 0.10
Nodes (19): ReturnDetailPage(), ReturnsPage(), ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs() (+11 more)

### Community 23 - "debounced-input.tsx"
Cohesion: 0.16
Nodes (11): contactFilterOptions, ContactTableToolbar(), ContactTableToolbarProps, FilterOption, InvoiceFilter(), InvoiceTableToolbar(), FilterOption, paymentFilterOptions (+3 more)

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.15
Nodes (15): CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter(), CostCenterTableBody(), CostCenterTableBodyProps (+7 more)

### Community 25 - "lib/utils.ts"
Cohesion: 0.40
Nodes (6): ItemImage, ImageUploader(), ImageUploaderProps, ItemGalleryModal(), ItemGalleryModalProps, ItemSidebarProps

### Community 26 - "lib/items.ts"
Cohesion: 0.20
Nodes (10): EditItemPage(), UseItemsParams, useItemById(), useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse, ItemsListApiData (+2 more)

### Community 27 - "contacts/[id]/page.tsx"
Cohesion: 0.11
Nodes (19): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailGeneral() (+11 more)

### Community 28 - "Comentarios con @mentions + Notificaciones en tiempo real"
Cohesion: 0.08
Nodes (23): API — Comentarios, API — Notificaciones, Arquitectura, Campanita del navbar/header, Comentarios con @mentions + Notificaciones en tiempo real, `DELETE /v1/comments/{id}`, Despliegue en Railway — servicio nuevo `factucore_websockets`, `GET /v1/comments/mentionable-users?search=jua` (+15 more)

### Community 29 - "cn"
Cohesion: 0.06
Nodes (42): react, react, AttributeModal(), AttributeModalProps, FormattedInput(), NewInvoiceComments(), FormattedInput(), FormattedInput() (+34 more)

### Community 30 - "quotes/[id]/edit/page.tsx"
Cohesion: 0.15
Nodes (20): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePage(), NewInvoiceOptions(), NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps (+12 more)

### Community 31 - "InvoicesService"
Cohesion: 0.16
Nodes (5): InvoiceDetailPage(), InvoiceDianStatus(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "useQuotes.ts"
Cohesion: 0.10
Nodes (17): QuoteDetailPage(), QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps (+9 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.16
Nodes (9): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+1 more)

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.12
Nodes (20): FacturasVentaViewProps, RemissionsPage(), RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns(), FilterChips() (+12 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.10
Nodes (23): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+15 more)

### Community 36 - "items/page.tsx"
Cohesion: 0.15
Nodes (12): ItemDetailPage(), FormState, ItemsPage(), ItemAccounting(), ItemAttachments(), ItemHeader(), StatusToggle(), ItemInventory() (+4 more)

### Community 37 - "invoice.ts"
Cohesion: 0.14
Nodes (13): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDian, InvoiceEstablishment, InvoiceFindAllEmpty (+5 more)

### Community 38 - "usePurchaseOrders.ts"
Cohesion: 0.09
Nodes (26): InternalPurchaseOrderDetailPage(), InternalPurchaseOrdersPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), PurchaseOrdersPage(), PurchaseOrderPageHeader(), PurchaseOrderTable(), PurchaseOrderTableProps (+18 more)

### Community 39 - "activate-account/page.tsx"
Cohesion: 0.16
Nodes (14): ActivateAccountPage(), ConfirmEmailPage(), ForgotPasswordPage(), ResetPasswordPage(), AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), InvoiceStats (+6 more)

### Community 40 - "IntegrationsService"
Cohesion: 0.10
Nodes (19): ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), CreateWebhookModalProps, RotateSecretModal(), RotateSecretModalProps, WebhookDeliveriesModal() (+11 more)

### Community 41 - "payments/[id]/page.tsx"
Cohesion: 0.24
Nodes (7): Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailTabs(), PaymentDetailTotal(), PaymentDetailTotalProps

### Community 42 - "showToast"
Cohesion: 0.13
Nodes (26): CostCentersPage(), EditInternalPurchaseOrderPage(), toDateInput(), NewInternalPurchaseOrderPage(), EditResolutionPage(), NewResolutionPage(), EditResolutionModal(), NewInternalPurchaseOrderFooter() (+18 more)

### Community 43 - "cn"
Cohesion: 0.05
Nodes (47): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList() (+39 more)

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.22
Nodes (9): PaymentTable(), SelectionState, ServerPagination, getPaymentColumns(), PaymentTableBody(), PaymentTablePagination(), PaymentTablePaginationProps, ServerPagination (+1 more)

### Community 45 - "ContactAdvancedForm.tsx"
Cohesion: 0.14
Nodes (21): NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm() (+13 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.23
Nodes (9): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceDetailResponse, InvoiceFindAllSuccess (+1 more)

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.13
Nodes (16): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels, ItemFilterChips(), ItemFilterChipsProps (+8 more)

### Community 49 - "searchable-select.tsx"
Cohesion: 0.18
Nodes (14): NewPaymentFormProps, OtherIncomeTable(), OtherIncomeTableProps, PaymentNumberingModal(), PaymentNumberingModalProps, PurchaseOrderGlobalAdjustments(), PurchaseOrderLineItemsTable(), baseSchema (+6 more)

### Community 50 - "CompanyProfileForm.tsx"
Cohesion: 0.29
Nodes (6): CompanyProfileForm(), getInitials(), useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.11
Nodes (20): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceTable(), InvoiceTableProps, ServerPagination, getColumns(), FilterChips() (+12 more)

### Community 54 - "ApiResponse"
Cohesion: 0.12
Nodes (6): ActionsCell(), PaymentTermsService, PurchaseOrdersService, SellersService, ApiResponse, PurchaseOrder

### Community 55 - "ItemDocumentsTab.tsx"
Cohesion: 0.32
Nodes (11): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+3 more)

### Community 56 - "form.tsx"
Cohesion: 0.23
Nodes (11): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+3 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 60 - "extractErrorMessage"
Cohesion: 0.19
Nodes (12): ChangePasswordDialog(), ChangePasswordDialogProps, TwoFactorPanel(), useChangePassword(), useConfirmTwoFactor(), useDisableTwoFactor(), useEnableTwoFactor(), useRegenerateRecoveryCodes() (+4 more)

### Community 61 - "Sidebar.tsx"
Cohesion: 0.20
Nodes (11): AuthenticatedLayout(), Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem (+3 more)

### Community 62 - "PaymentDetailTabs.tsx"
Cohesion: 0.31
Nodes (5): PaymentDetailAccounting(), PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailAdvances(), PaymentDetailTabsProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.13
Nodes (15): CompanyProfilePage(), LoginPage(), RootPage(), SplashScreen(), SplashScreenProps, UserMenu(), UserMenuProps, AuthContext (+7 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.10
Nodes (12): AccordionContent(), AccordionItem(), AccordionTrigger(), HoverCardContent(), ResizableHandle(), ResizablePanelGroup(), Slider(), ToggleGroup() (+4 more)

### Community 65 - "remission.ts"
Cohesion: 0.11
Nodes (19): REMISSIONS_KEY, useDeleteRemission(), AllowanceCharge, Remission, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer (+11 more)

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "ProfileService"
Cohesion: 0.21
Nodes (10): SecurityPage(), ConnectedDevicesSection(), formatRelativeTime(), TwoFactorSection(), Skeleton(), useDevices(), useProfile(), useRevokeDevice() (+2 more)

### Community 69 - "NewReturnForm.tsx"
Cohesion: 0.17
Nodes (9): ChangeClientModal(), ChangeTypeModal(), ExitFormModal(), AddedLine, NewReturnForm(), createEmptyLine(), FieldError, NewReturnForm() (+1 more)

### Community 70 - "chart.tsx"
Cohesion: 0.19
Nodes (13): DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidgetProps, ChartConfig, ChartContainer(), ChartContext, ChartContextProps (+5 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.09
Nodes (21): RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step, TwoFactorPanelProps, InputOTP() (+13 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales"
Cohesion: 0.22
Nodes (8): Contrato de API actualizado, Edición (`PATCH /purchase-orders/{id}`), La respuesta ahora trae totales reales, Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales, Qué hay que agregar al formulario de items, Recapitulación: dos tipos de orden de compra (sigue igual), Resumen de lo que hay que construir/ajustar, Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

### Community 74 - "field.tsx"
Cohesion: 0.15
Nodes (18): PasswordResetFormProps, TwoFactorChallengeForm(), TwoFactorChallengeFormProps, ChangeEmailDialog(), ChangeEmailDialogProps, Field(), FieldContent(), FieldDescription() (+10 more)

### Community 75 - "ItemDetailView.tsx"
Cohesion: 0.32
Nodes (7): formatMoney(), getItemTypeName(), InfoChip(), InfoField(), ItemDetailView(), StatusToggle(), TabButton()

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "remissions/[id]/page.tsx"
Cohesion: 0.12
Nodes (10): RemissionDetailPage(), RemissionDetailDocument(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps, RemissionPageHeader() (+2 more)

### Community 80 - "ReturnsTableBody.tsx"
Cohesion: 0.22
Nodes (7): ReturnsTableProps, ReturnRow(), ReturnsTableBody(), ReturnsTableBodyProps, ReturnsTablePagination(), ReturnsTablePaginationProps, ReturnsTableToolbar()

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "software/page.tsx"
Cohesion: 0.40
Nodes (4): SoftwarePage(), NewSoftwareModal(), SoftwareList(), softwaresApi

### Community 86 - "CompanySummaryCard.tsx"
Cohesion: 0.31
Nodes (5): CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid()

### Community 87 - "button.tsx"
Cohesion: 0.15
Nodes (10): NewCertificateForm(), QuoteDetailHeaderProps, StatusBadge(), RemissionExportModal(), RemissionPageHeaderProps, NewSoftwareForm(), Button(), buttonVariants (+2 more)

### Community 88 - "api-client.ts"
Cohesion: 0.17
Nodes (8): DOCUMENT_TYPES, DocumentType, envs, DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), QuoteFindAllSuccess

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "Resolution"
Cohesion: 0.15
Nodes (15): EditResolutionModalProps, ResolutionFormProps, ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns(), ResolutionFilterChips(), ResolutionTableBody() (+7 more)

### Community 92 - "CustomToaster.tsx"
Cohesion: 0.15
Nodes (10): metadata, ConfigCostCentersModal(), ConfigCostCentersModalProps, DOCUMENT_TYPES, CustomToaster(), CustomToastProps, ToastIcon(), ToastType (+2 more)

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

### Community 97 - "MonthSelector.tsx"
Cohesion: 0.50
Nodes (3): monthOptions, MonthSelector(), MonthSelectorProps

### Community 98 - "CuentasPorCobrarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorCobrarData, CuentasPorCobrarWidget(), CuentasPorCobrarWidgetProps

### Community 99 - "CuentasPorPagarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 100 - "[role]/page.tsx"
Cohesion: 0.12
Nodes (22): MODULES, PermissionGroupCard(), RolePermissionsPage(), getInitials(), UsersPage(), VALID_ROLES, Tabs(), TabsContent() (+14 more)

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 113 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 119 - "QuoteItemsTable.tsx"
Cohesion: 0.15
Nodes (23): InvoiceItemsTable(), ItemRow(), InvoiceItem, NewInvoiceViewProps, ItemRow(), ItemRow(), QuoteItemsTable(), ItemRow() (+15 more)

### Community 121 - "PersonalDataSection.tsx"
Cohesion: 0.33
Nodes (7): getInitials(), isTenantProfile(), PersonalDataSection(), useUpdateProfile(), extractFieldErrors(), ProfileTenant, UpdateProfilePayload

### Community 123 - "dependencies"
Cohesion: 0.13
Nodes (15): cmdk, @dnd-kit/core, @dnd-kit/sortable, dependencies, cmdk, @dnd-kit/core, @dnd-kit/sortable, @radix-ui/react-collapsible (+7 more)

### Community 125 - "useCatalogs"
Cohesion: 0.27
Nodes (10): EditContactContent(), ResolutionsPage(), getSession(), SessionData, NewInvoiceMain(), WithholdingsModal(), NewQuoteMain(), NewRemissionMain() (+2 more)

### Community 141 - "Header.tsx"
Cohesion: 0.15
Nodes (18): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog() (+10 more)

### Community 198 - "PaymentFilterChips.tsx"
Cohesion: 0.22
Nodes (9): PaymentTableProps, filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES, PaymentFilterChips(), PaymentFilterChipsProps, paymentFilterOptions, PaymentTableBodyProps (+1 more)

### Community 201 - "ItemResponse"
Cohesion: 0.33
Nodes (6): TabConfig, ItemHeaderProps, ItemPriceLists(), ItemPriceListsProps, ItemDetailViewProps, ItemResponse

### Community 202 - "payments/page.tsx"
Cohesion: 0.53
Nodes (3): PaymentsPage(), usePayments(), PaymentListResponse

### Community 203 - "PaymentInvoicesList.tsx"
Cohesion: 0.40
Nodes (5): parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps, WithholdingEntry, PopoverAnchor()

### Community 204 - "RemissionDetailHeader.tsx"
Cohesion: 0.40
Nodes (5): RemissionDetailHeader(), RemissionDetailHeaderProps, ActionsCell(), isRemissionInvoiced(), StatusBadge()

### Community 205 - "ReturnsTableToolbar.tsx"
Cohesion: 0.40
Nodes (4): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsTableToolbarProps

### Community 206 - "certificates/page.tsx"
Cohesion: 0.40
Nodes (4): CertificatesPage(), CertificateList(), NewCertificateModal(), certificatesApi

### Community 207 - "ItemTableToolbar.tsx"
Cohesion: 0.40
Nodes (4): FilterOption, itemFilterOptions, ItemTableToolbar(), ItemTableToolbarProps

### Community 208 - "PaymentDetailInfo.tsx"
Cohesion: 0.50
Nodes (3): PaymentDetailInfo(), PaymentDetailInfoProps, PaymentStatusBadge()

## Knowledge Gaps
- **618 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+613 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **83 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `tooltip.tsx`, `NewRemissionMain.tsx`, `PaymentsService`, `sidebar.tsx`, `invoices/new/page.tsx`, `quote.ts`, `dashboard/page.tsx`, `dropdown-menu.tsx`, `QuickCreateItemModal.tsx`, `NewQuoteSettingsDrawer.tsx`, `returns/[id]/page.tsx`, `debounced-input.tsx`, `CostCenterTable.tsx`, `lib/utils.ts`, `contacts/[id]/page.tsx`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `contacts/page.tsx`, `items/page.tsx`, `usePurchaseOrders.ts`, `showToast`, `PaymentTable.tsx`, `ItemTable.tsx`, `searchable-select.tsx`, `carousel.tsx`, `InvoiceTable.tsx`, `ApiResponse`, `ItemDocumentsTab.tsx`, `form.tsx`, `Sidebar.tsx`, `ui/utils.ts`, `PaymentFilterChips.tsx`, `chart.tsx`, `TwoFactorPanel.tsx`, `payments/page.tsx`, `ItemDetailView.tsx`, `RemissionDetailHeader.tsx`, `certificates/page.tsx`, `remissions/[id]/page.tsx`, `ReturnsTableBody.tsx`, `software/page.tsx`, `button.tsx`, `Resolution`, `CustomToaster.tsx`, `QuoteItemsTable.tsx`, `dependencies`, `useCatalogs`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `tooltip.tsx`, `dialog.tsx`, `types/auth.ts`, `NewRemissionMain.tsx`, `invoice/table/columns.tsx`, `PaymentsService`, `invoices/new/page.tsx`, `quote.ts`, `dashboard/page.tsx`, `dropdown-menu.tsx`, `useNotifications.ts`, `QuickCreateItemModal.tsx`, `NewQuoteSettingsDrawer.tsx`, `returns/[id]/page.tsx`, `lib/items.ts`, `contacts/[id]/page.tsx`, `cn`, `quotes/[id]/edit/page.tsx`, `InvoicesService`, `useQuotes.ts`, `invoices/[id]/page.tsx`, `items/page.tsx`, `activate-account/page.tsx`, `IntegrationsService`, `ContactAdvancedForm.tsx`, `searchable-select.tsx`, `CompanyProfileForm.tsx`, `ApiResponse`, `extractErrorMessage`, `Sidebar.tsx`, `auth-context.tsx`, `ProfileService`, `NewReturnForm.tsx`, `TwoFactorPanel.tsx`, `payments/page.tsx`, `PaymentInvoicesList.tsx`, `field.tsx`, `RemissionDetailHeader.tsx`, `remissions/[id]/page.tsx`, `DashboardPage`, `button.tsx`, `CustomToaster.tsx`, `QuoteItemsTable.tsx`, `PersonalDataSection.tsx`, `useCatalogs`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `next-themes`, `@hookform/resolvers`, `html2canvas`, `input-otp`, `next`, `react-hook-form`, `radix-ui`, `clsx`, `@radix-ui/react-checkbox`, `@radix-ui/react-label`, `devDependencies`, `lucide-react`, `pusher-js`, `jspdf`, `@radix-ui/react-progress`, `laravel-echo`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `postcss`, `@radix-ui/react-toggle-group`, `react-dom`, `react-qr-code`, `@radix-ui/react-alert-dialog`, `react-resizable-panels`, `@radix-ui/react-aspect-ratio`, `cn`, `@radix-ui/react-avatar`, `sonner`, `@radix-ui/react-dialog`, `tailwind-merge`, `@radix-ui/react-dropdown-menu`, `@tanstack/query-sync-storage-persister`, `@radix-ui/react-context-menu`, `@tanstack/react-query-persist-client`, `vaul`, `axios`, `@radix-ui/react-menubar`, `@radix-ui/react-hover-card`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-slot`, `@radix-ui/react-select`, `@radix-ui/react-toggle`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@tabler/icons-react`, `class-variance-authority`, `react-day-picker`, `recharts`, `@tanstack/react-query`, `zod`, `date-fns`, `dayjs`, `geist`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`, `embla-carousel-react`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _618 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1431451612903226 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11748381128584644 - nodes in this community are weakly interconnected._
- **Should `types/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._