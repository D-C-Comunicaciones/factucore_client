# Graph Report - facturacion-cliente  (2026-08-17)

## Corpus Check
- 542 files · ~294,379 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2485 nodes · 7407 edges · 199 communities (121 shown, 78 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `149f245f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- table.tsx
- tooltip.tsx
- dialog.tsx
- types/auth.ts
- types/catalogs.ts
- select.tsx
- invoice/table/columns.tsx
- PaymentsService
- cn
- remissions/new/page.tsx
- QuoteTable.tsx
- react
- dashboard/page.tsx
- AuthService
- Button
- devDependencies
- useNotifications.ts
- compilerOptions
- showToast
- types/items.ts
- NewQuoteSettingsDrawer.tsx
- components.json
- returns/[id]/page.tsx
- debounced-input.tsx
- UserInfoPanel.tsx
- quotes/[id]/page.tsx
- api.ts
- contacts/[id]/page.tsx
- Comentarios con @mentions + Notificaciones en tiempo real
- cn
- invoices/new/page.tsx
- InvoicesService
- quote.ts
- invoices/[id]/page.tsx
- RemissionTable.tsx
- contacts/page.tsx
- items/[id]/page.tsx
- invoice.ts
- expenses/purchase-orders/new/page.tsx
- login/page.tsx
- button.tsx
- payments/[id]/page.tsx
- ConfigCostCentersModal.tsx
- drawer.tsx
- PaymentTable.tsx
- ContactAdvancedForm.tsx
- useInvoices.ts
- tasks/page.tsx
- ItemTable.tsx
- searchable-select.tsx
- useCompanyProfile.ts
- carousel.tsx
- navigation-menu.tsx
- InvoiceTable.tsx
- ApiResponse
- ItemDocumentsTab.tsx
- form.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- menubar.tsx
- useTwoFactorMutations.ts
- Sidebar.tsx
- PaymentDetailTabs.tsx
- auth-context.tsx
- ui/utils.ts
- remission.ts
- exports.md Reference Guide
- ReportsSections.tsx
- ProfileService
- NewReturnForm
- chart.tsx
- TwoFactorPanel.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales
- CompanyProfileForm.tsx
- pagination.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- remissions/[id]/page.tsx
- formatCurrency
- checkbox.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- breadcrumb.tsx
- Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona
- calendar.tsx
- remissions.ts
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- useResolutions
- CustomToaster.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- toggle-group.tsx
- ContactDetailGeneral.tsx
- CuentasPorPagarWidget.tsx
- [role]/page.tsx
- invoice/InvoiceItemsTable.tsx
- context-menu.tsx
- [filename]/page.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- tailwindcss-animate
- EmptyStateWidget.tsx
- dayjs
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- QuoteItemsTable.tsx
- extractErrorMessage
- geist
- dependencies
- @dnd-kit/modifiers
- NewRemissionMain.tsx
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- next-themes
- @hookform/resolvers
- html2canvas
- input-otp
- next
- react-hook-form
- radix-ui
- clsx
- @radix-ui/react-checkbox
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
- api-client.ts
- date-fns

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 214 edges
2. `cn()` - 198 edges
3. `cn()` - 141 edges
4. `react` - 119 edges
5. `Button()` - 113 edges
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

## Communities (199 total, 78 thin omitted)

### Community 0 - "table.tsx"
Cohesion: 0.06
Nodes (59): SoftwarePage(), FactucoreLogo(), FactucoreLogoProps, CertificateListProps, CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink (+51 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.16
Nodes (15): ContactCommercialInfoProps, CustomFieldModalProps, FALLBACK_FIELD_TYPES, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, GeneralInfoSectionProps, ItemType (+7 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.09
Nodes (30): NewCertificateModalProps, ProductGalleryModalProps, CreateWarehouseModal(), CreateWarehouseModalProps, NewPaymentTermModalProps, PaymentNumberingModal(), PaymentNumberingModalProps, PaymentTabs() (+22 more)

### Community 3 - "types/auth.ts"
Cohesion: 0.14
Nodes (18): ChangeEmailDialog(), useChangeEmail(), useVerifyPassword(), ChangeEmailPayload, ConfirmEmailPayload, DeviceSession, ForgotPasswordResponse, LoginRequires2FA (+10 more)

### Community 4 - "types/catalogs.ts"
Cohesion: 0.12
Nodes (15): Attribute, Category, Country, CustomField, Department, Municipality, Plan, PriceList (+7 more)

### Community 5 - "select.tsx"
Cohesion: 0.20
Nodes (15): ContactAccountingInfoProps, InvoiceItemsTable(), InvoiceItem, NewInvoiceViewProps, QuoteExportModalProps, RemissionExportModalProps, ResolutionFilterChipsProps, NewTaxRateModalProps (+7 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.11
Nodes (25): NewCertificateForm(), NewCertificateFormProps, InvoiceDetailHeaderProps, contactLabel(), PurchaseOrderDetailView(), contactLabel(), InternalPurchaseOrderDetailView(), PurchaseOrderStatusBadge() (+17 more)

### Community 7 - "PaymentsService"
Cohesion: 0.28
Nodes (4): PaymentDetailPage(), NewPaymentPageContent(), usePayment(), PaymentsService

### Community 8 - "cn"
Cohesion: 0.07
Nodes (47): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), CardAction(), CardDescription(), CardFooter(), CardHeader() (+39 more)

### Community 9 - "remissions/new/page.tsx"
Cohesion: 0.10
Nodes (27): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), RemissionDetailPage(), NewRemissionPageContent(), NewRemissionFooter(), NewRemissionHeader(), NewRemissionHeaderProps (+19 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.10
Nodes (23): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), QuoteFilter(), QuotePageHeader(), QuoteTable(), QuoteTableProps (+15 more)

### Community 11 - "react"
Cohesion: 0.11
Nodes (17): react, react, ContactTablePagination(), ContactTablePaginationProps, ServerPagination, FormattedInput(), NewInvoiceComments(), FormattedInput() (+9 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.05
Nodes (40): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, DeleteWidgetDialog(), DeleteWidgetDialogProps, EmptyDashboardState() (+32 more)

### Community 13 - "AuthService"
Cohesion: 0.17
Nodes (7): AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), AuthService, AuthBootstrap()

### Community 14 - "Button"
Cohesion: 0.07
Nodes (47): ContactDetailHeaderProps, CostCenterFilterProps, FilterOption, defaultFilterOptions, FilterOption, InvoiceFilterProps, InvoicePageHeaderProps, filterIcons (+39 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (32): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+24 more)

### Community 16 - "useNotifications.ts"
Cohesion: 0.17
Nodes (16): DOCUMENT_ROUTES, NotificationBell(), timeAgo(), getChannelName(), LIST_KEY(), UNREAD_COUNT_KEY, useMarkAllNotificationsRead(), useMarkNotificationRead() (+8 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "showToast"
Cohesion: 0.10
Nodes (35): ItemDetailPage(), NewItemPage(), FormState, ItemsPage(), ResolutionsPage(), NewCategoryModal(), CustomFieldModal(), InvoiceDianStatus() (+27 more)

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.18
Nodes (17): CategoryModalProps, CostCenter, NewCostCenterModal(), NewCostCenterModalProps, NewPriceListModal(), NewPriceListModalProps, FixedFields, FixedFields (+9 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "returns/[id]/page.tsx"
Cohesion: 0.13
Nodes (12): ReturnDetailPage(), ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), CREDIT_NOTE_KEY(), CREDIT_NOTES_KEY, extractCreditNote(), useCreditNote() (+4 more)

### Community 23 - "debounced-input.tsx"
Cohesion: 0.14
Nodes (14): ReturnsPage(), FilterOption, paymentFilterOptions, PaymentTableToolbarProps, ReturnPageHeader(), ReturnsTable(), ReturnsTableProps, ReturnsTableBody() (+6 more)

### Community 24 - "UserInfoPanel.tsx"
Cohesion: 0.21
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), UserInfoPanelProps (+1 more)

### Community 25 - "quotes/[id]/page.tsx"
Cohesion: 0.19
Nodes (8): QuoteDetailDocument(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailHeader(), QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps, CommentsAndReminders()

### Community 26 - "api.ts"
Cohesion: 0.17
Nodes (11): EditItemPage(), UseItemsParams, useItemById(), ToggleStatusParams, useUpdateItem(), itemsApi, PaginatedData, GetItemByIdResponse (+3 more)

### Community 27 - "contacts/[id]/page.tsx"
Cohesion: 0.15
Nodes (12): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailBranchesProps, ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader() (+4 more)

### Community 28 - "Comentarios con @mentions + Notificaciones en tiempo real"
Cohesion: 0.08
Nodes (23): API — Comentarios, API — Notificaciones, Arquitectura, Campanita del navbar/header, Comentarios con @mentions + Notificaciones en tiempo real, `DELETE /v1/comments/{id}`, Despliegue en Railway — servicio nuevo `factucore_websockets`, `GET /v1/comments/mentionable-users?search=jua` (+15 more)

### Community 29 - "cn"
Cohesion: 0.08
Nodes (36): ItemImage, AttributeModal(), AttributeModalProps, CreateCurrencyModalProps, NewCurrencyModal(), StatusToggle(), InfoChip(), InfoField() (+28 more)

### Community 30 - "invoices/new/page.tsx"
Cohesion: 0.10
Nodes (31): NewInvoicePageContent(), EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewQuotePageContent(), NewInvoiceFooter(), NewInvoiceHeader(), NewInvoiceHeaderProps (+23 more)

### Community 31 - "InvoicesService"
Cohesion: 0.16
Nodes (4): InvoiceDetailPage(), useSendInvoice(), InvoicesService, Invoice

### Community 32 - "quote.ts"
Cohesion: 0.08
Nodes (26): QuoteDetailPage(), ActionsCell(), INVOICE_KEY(), INVOICES_KEY, usePrefetchQuoteDetail(), useSendQuote(), useUpdateQuote(), QuotesService (+18 more)

### Community 33 - "invoices/[id]/page.tsx"
Cohesion: 0.13
Nodes (13): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+5 more)

### Community 34 - "RemissionTable.tsx"
Cohesion: 0.11
Nodes (20): FacturasVentaViewProps, RemissionsPage(), RemissionFilter(), RemissionPageHeader(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns() (+12 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.10
Nodes (24): Contact, ContactPage(), ContactType, Contact, ContactTable(), ContactTableProps, SelectionState, ServerPagination (+16 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.12
Nodes (14): ItemAccounting(), ItemAttachments(), TabConfig, ItemHeader(), ItemHeaderProps, ItemInventory(), InfoChip(), ItemMainInfo() (+6 more)

### Community 37 - "invoice.ts"
Cohesion: 0.12
Nodes (16): AllowanceCharge, DianSubmissionStatus, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDetailResponse, InvoiceDian (+8 more)

### Community 38 - "expenses/purchase-orders/new/page.tsx"
Cohesion: 0.06
Nodes (42): EditInternalPurchaseOrderPage(), toDateInput(), InternalPurchaseOrderDetailPage(), NewInternalPurchaseOrderPage(), InternalPurchaseOrdersPage(), EditPurchaseOrderPage(), PurchaseOrderDetailPage(), PurchaseOrdersPage() (+34 more)

### Community 39 - "login/page.tsx"
Cohesion: 0.19
Nodes (9): AuthLinkStatus(), AuthLinkStatusProps, PasswordResetForm(), PasswordResetFormProps, InvoiceStats, StatCardProps, LogoHorizontal(), Card() (+1 more)

### Community 40 - "button.tsx"
Cohesion: 0.08
Nodes (21): ContactComments(), ApiKeysTab(), CreateApiKeyModal(), CreateApiKeyModalProps, CreateWebhookModal(), CreateWebhookModalProps, RotateSecretModal(), RotateSecretModalProps (+13 more)

### Community 41 - "payments/[id]/page.tsx"
Cohesion: 0.24
Nodes (7): Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailInfo(), PaymentDetailInfoProps, PaymentStatusBadge()

### Community 42 - "ConfigCostCentersModal.tsx"
Cohesion: 0.40
Nodes (4): CostCentersPage(), ConfigCostCentersModal(), ConfigCostCentersModalProps, DOCUMENT_TYPES

### Community 43 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 44 - "PaymentTable.tsx"
Cohesion: 0.18
Nodes (12): PaymentsPage(), PaymentTable(), SelectionState, ServerPagination, getPaymentColumns(), PaymentTableBody(), PaymentTablePagination(), PaymentTablePaginationProps (+4 more)

### Community 45 - "ContactAdvancedForm.tsx"
Cohesion: 0.15
Nodes (19): NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps, ContactBasicForm() (+11 more)

### Community 46 - "useInvoices.ts"
Cohesion: 0.30
Nodes (8): InvoiceEditPage(), extractInvoiceFromDetail(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useUpdateInvoice(), InvoiceListData

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.11
Nodes (20): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels, ItemFilterChips(), ItemFilterChipsProps (+12 more)

### Community 49 - "searchable-select.tsx"
Cohesion: 0.19
Nodes (15): NewPaymentFormProps, OtherIncomeTable(), OtherIncomeTableProps, PurchaseOrderGlobalAdjustments(), PurchaseOrderLineItemsTable(), baseSchema, formSchema, FieldError (+7 more)

### Community 50 - "useCompanyProfile.ts"
Cohesion: 0.48
Nodes (4): useUpdateCompanyProfile(), CompanyProfileService, CompanyProfileUpdatePayload, CompanyProfileUpdateResponse

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.10
Nodes (22): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceTable(), InvoiceTableProps, ServerPagination, StatCard(), getColumns() (+14 more)

### Community 54 - "ApiResponse"
Cohesion: 0.08
Nodes (10): ActionsCell(), ApiClient, categoriesApi, currenciesApi, PaymentTermsService, priceListsApi, PurchaseOrdersService, SellersService (+2 more)

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

### Community 60 - "useTwoFactorMutations.ts"
Cohesion: 0.23
Nodes (8): TwoFactorPanel(), useConfirmTwoFactor(), useDisableTwoFactor(), useEnableTwoFactor(), useRegenerateRecoveryCodes(), RecoveryCodesRegeneratePayload, TwoFactorConfirmPayload, TwoFactorDisablePayload

### Community 61 - "Sidebar.tsx"
Cohesion: 0.16
Nodes (13): AuthenticatedLayout(), Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps, Sidebar(), SidebarMenuItem (+5 more)

### Community 62 - "PaymentDetailTabs.tsx"
Cohesion: 0.38
Nodes (4): PaymentDetailAccounting(), PaymentDetailAdvances(), PaymentDetailTabs(), PaymentDetailTabsProps

### Community 63 - "auth-context.tsx"
Cohesion: 0.14
Nodes (15): CompanyProfilePage(), LoginPage(), RootPage(), SplashScreen(), UserMenu(), UserMenuProps, AuthContext, AuthContextType (+7 more)

### Community 64 - "ui/utils.ts"
Cohesion: 0.08
Nodes (13): AccordionContent(), AccordionItem(), AccordionTrigger(), Alert(), AlertDescription(), AlertTitle(), alertVariants, HoverCardContent() (+5 more)

### Community 65 - "remission.ts"
Cohesion: 0.13
Nodes (14): AllowanceCharge, RemissionBill, RemissionBillingPeriod, RemissionCompany, RemissionCustomer, RemissionDian, RemissionEstablishment, RemissionFindAllEmpty (+6 more)

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "ProfileService"
Cohesion: 0.18
Nodes (11): SecurityPage(), ConnectedDevicesSection(), formatRelativeTime(), TwoFactorSection(), Skeleton(), useDevices(), useProfile(), useRevokeDevice() (+3 more)

### Community 69 - "NewReturnForm"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 70 - "chart.tsx"
Cohesion: 0.14
Nodes (18): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ClienteItem, MejoresClientesWidget(), MejoresClientesWidgetProps, ProductoItem, ProductosMasVendidosWidget() (+10 more)

### Community 71 - "TwoFactorPanel.tsx"
Cohesion: 0.16
Nodes (12): TwoFactorChallengeForm(), TwoFactorChallengeFormProps, RecoveryCodesDisplay(), RecoveryCodesDisplayProps, CodeMode, ENABLE_STEP_PROGRESS, OTP_SLOTS, Step (+4 more)

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales"
Cohesion: 0.22
Nodes (8): Contrato de API actualizado, Edición (`PATCH /purchase-orders/{id}`), La respuesta ahora trae totales reales, Qué cambió: ahora sí traen descuentos, impuestos e ajustes globales, Qué hay que agregar al formulario de items, Recapitulación: dos tipos de orden de compra (sigue igual), Resumen de lo que hay que construir/ajustar, Órdenes de compra: ajustes de descuentos, impuestos y cargos globales

### Community 74 - "CompanyProfileForm.tsx"
Cohesion: 0.12
Nodes (19): CompanyProfileForm(), getInitials(), ExportConfig, ExportItemsModalProps, ChangeEmailDialogProps, ChangePasswordDialogProps, PasswordGateDialogProps, Field() (+11 more)

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

### Community 79 - "remissions/[id]/page.tsx"
Cohesion: 0.27
Nodes (5): RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps

### Community 80 - "formatCurrency"
Cohesion: 0.21
Nodes (10): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, PaymentDetailTotal(), PaymentDetailTotalProps, ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs(), ReturnDetailTabsProps (+2 more)

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 86 - "Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona"
Cohesion: 0.29
Nodes (6): Ajuste de flujo: emisión de facturas y notas crédito ahora es asíncrona, Contexto, Ejemplo de polling (pseudocódigo, adaptar al stack del frontend), Qué debe hacer el frontend, Qué NO cambia, Qué se rompe con el flujo actual

### Community 87 - "calendar.tsx"
Cohesion: 0.83
Nodes (3): buttonVariants, Calendar(), CalendarDayButton()

### Community 88 - "remissions.ts"
Cohesion: 0.31
Nodes (6): DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), RemissionDetailResponse, RemissionFindAllSuccess

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "useResolutions"
Cohesion: 0.13
Nodes (21): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, ResolutionForm(), ResolutionFormProps, ResolutionTable(), ResolutionTableProps, ServerPagination (+13 more)

### Community 92 - "CustomToaster.tsx"
Cohesion: 0.20
Nodes (7): metadata, CustomToaster(), CustomToastProps, ToastIcon(), ToastType, ThemeProvider(), Providers()

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

### Community 97 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 98 - "ContactDetailGeneral.tsx"
Cohesion: 0.47
Nodes (4): ContactDetailGeneral(), ContactDetailGeneralProps, RadioGroup(), RadioGroupItem()

### Community 99 - "CuentasPorPagarWidget.tsx"
Cohesion: 0.67
Nodes (3): CuentasPorPagarData, CuentasPorPagarWidget(), CuentasPorPagarWidgetProps

### Community 100 - "[role]/page.tsx"
Cohesion: 0.12
Nodes (22): MODULES, PermissionGroupCard(), RolePermissionsPage(), getInitials(), UsersPage(), VALID_ROLES, Tabs(), TabsContent() (+14 more)

### Community 103 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 119 - "QuoteItemsTable.tsx"
Cohesion: 0.18
Nodes (20): ItemRow(), ItemRow(), ItemRow(), QuoteItemsTable(), ItemRow(), RemissionItemsTable(), PopoverClose(), GlobalAdjustment (+12 more)

### Community 121 - "extractErrorMessage"
Cohesion: 0.15
Nodes (16): ActivateAccountContent(), ConfirmEmailContent(), ForgotPasswordPage(), ResetPasswordContent(), ChangePasswordDialog(), PasswordGateDialog(), getInitials(), isTenantProfile() (+8 more)

### Community 123 - "dependencies"
Cohesion: 0.13
Nodes (15): axios, cmdk, @dnd-kit/core, @dnd-kit/sortable, dependencies, axios, cmdk, @dnd-kit/core (+7 more)

### Community 125 - "NewRemissionMain.tsx"
Cohesion: 0.25
Nodes (14): EditContactContent(), getSession(), SessionData, AddContactModal(), EditResolutionModal(), NewInvoiceMain(), NewPaymentTermModal(), NewQuoteMain() (+6 more)

### Community 141 - "Header.tsx"
Cohesion: 0.15
Nodes (18): Factucore Horizontal Logo, HeaderProps, SolutionsPopover(), SolutionsPopoverProps, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Command(), CommandDialog() (+10 more)

### Community 198 - "PaymentFilterChips.tsx"
Cohesion: 0.22
Nodes (9): PaymentTableProps, filterLabels, MOCK_BANK_ACCOUNTS, PAYMENT_STATUSES, PaymentFilterChips(), PaymentFilterChipsProps, paymentFilterOptions, PaymentTableBodyProps (+1 more)

### Community 206 - "api-client.ts"
Cohesion: 0.15
Nodes (8): CertificatesPage(), CertificateList(), NewCertificateModal(), envs, AttributePayload, attributesApi, certificatesApi, ReverbEcho

## Knowledge Gaps
- **626 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+621 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `table.tsx`, `tooltip.tsx`, `dialog.tsx`, `select.tsx`, `invoice/table/columns.tsx`, `PaymentsService`, `cn`, `QuoteTable.tsx`, `Button`, `showToast`, `NewQuoteSettingsDrawer.tsx`, `debounced-input.tsx`, `quotes/[id]/page.tsx`, `cn`, `invoices/new/page.tsx`, `quote.ts`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `contacts/page.tsx`, `items/[id]/page.tsx`, `expenses/purchase-orders/new/page.tsx`, `ConfigCostCentersModal.tsx`, `PaymentTable.tsx`, `ItemTable.tsx`, `searchable-select.tsx`, `carousel.tsx`, `InvoiceTable.tsx`, `ApiResponse`, `ItemDocumentsTab.tsx`, `form.tsx`, `Sidebar.tsx`, `ui/utils.ts`, `chart.tsx`, `PaymentFilterChips.tsx`, `TwoFactorPanel.tsx`, `api-client.ts`, `calendar.tsx`, `useResolutions`, `toggle-group.tsx`, `dependencies`, `NewRemissionMain.tsx`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `table.tsx`, `tooltip.tsx`, `dialog.tsx`, `types/auth.ts`, `select.tsx`, `invoice/table/columns.tsx`, `PaymentsService`, `remissions/new/page.tsx`, `QuoteTable.tsx`, `react`, `dashboard/page.tsx`, `Button`, `useNotifications.ts`, `NewQuoteSettingsDrawer.tsx`, `returns/[id]/page.tsx`, `quotes/[id]/page.tsx`, `api.ts`, `contacts/[id]/page.tsx`, `cn`, `invoices/new/page.tsx`, `InvoicesService`, `quote.ts`, `invoices/[id]/page.tsx`, `RemissionTable.tsx`, `expenses/purchase-orders/new/page.tsx`, `login/page.tsx`, `button.tsx`, `ConfigCostCentersModal.tsx`, `PaymentTable.tsx`, `ContactAdvancedForm.tsx`, `searchable-select.tsx`, `useCompanyProfile.ts`, `ApiResponse`, `useTwoFactorMutations.ts`, `Sidebar.tsx`, `auth-context.tsx`, `ProfileService`, `NewReturnForm`, `TwoFactorPanel.tsx`, `CompanyProfileForm.tsx`, `remissions/[id]/page.tsx`, `useResolutions`, `CustomToaster.tsx`, `QuoteItemsTable.tsx`, `extractErrorMessage`, `NewRemissionMain.tsx`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `next-themes`, `@hookform/resolvers`, `html2canvas`, `input-otp`, `next`, `react-hook-form`, `radix-ui`, `clsx`, `@radix-ui/react-checkbox`, `react`, `@radix-ui/react-label`, `devDependencies`, `lucide-react`, `pusher-js`, `jspdf`, `@radix-ui/react-progress`, `laravel-echo`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `postcss`, `@radix-ui/react-toggle-group`, `react-dom`, `react-qr-code`, `@radix-ui/react-alert-dialog`, `react-resizable-panels`, `@radix-ui/react-aspect-ratio`, `sonner`, `@radix-ui/react-avatar`, `tailwind-merge`, `@radix-ui/react-dialog`, `@tanstack/query-sync-storage-persister`, `@radix-ui/react-dropdown-menu`, `@tanstack/react-query-persist-client`, `@radix-ui/react-context-menu`, `vaul`, `@radix-ui/react-menubar`, `@radix-ui/react-hover-card`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-radio-group`, `@radix-ui/react-slot`, `@radix-ui/react-select`, `@radix-ui/react-toggle`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@tabler/icons-react`, `class-variance-authority`, `react-day-picker`, `recharts`, `@tanstack/react-query`, `zod`, `date-fns`, `tailwindcss-animate`, `dayjs`, `geist`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`, `embla-carousel-react`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _626 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05518925518925519 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09158249158249158 - nodes in this community are weakly interconnected._
- **Should `types/auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._