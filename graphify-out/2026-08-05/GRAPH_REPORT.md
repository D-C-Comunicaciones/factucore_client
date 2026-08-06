# Graph Report - efac_frontend  (2026-08-05)

## Corpus Check
- 457 files · ~257,446 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2081 nodes · 5996 edges · 185 communities (112 shown, 73 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0cd5dc6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- NewReturnForm.tsx
- tooltip.tsx
- dialog.tsx
- AdvancedOptionsSection.tsx
- Sidebar.tsx
- NewQuoteSettingsDrawer.tsx
- invoice/table/columns.tsx
- cn
- sidebar.tsx
- NewReturnForm.backup.tsx
- QuoteTable.tsx
- ApiResponse
- dashboard/page.tsx
- auth-context.tsx
- button.tsx
- devDependencies
- useResolutions
- compilerOptions
- showToast
- types/items.ts
- NewRemissionMain.tsx
- components.json
- CreditNotesService
- ReturnsTableBody.tsx
- CostCenterTable.tsx
- lib/utils.ts
- invoices/new/page.tsx
- ui/utils.ts
- PaymentTable.tsx
- react
- QuoteItemsTable.tsx
- quote.ts
- useQuotes.ts
- InvoicesService
- remission.ts
- contacts/page.tsx
- items/[id]/page.tsx
- invoice.ts
- cn
- NewItemModal.tsx
- contacts/[id]/page.tsx
- returns/[id]/page.tsx
- ResolutionTable.tsx
- context-menu.tsx
- types/catalogs.ts
- AddContactModal.tsx
- payments/[id]/page.tsx
- tasks/page.tsx
- ItemTable.tsx
- invoices/[id]/page.tsx
- invoice/table/FilterChips.tsx
- carousel.tsx
- dependencies
- InvoiceTable.tsx
- remissions/[id]/edit/page.tsx
- AuthService
- ResolutionForm.tsx
- Extraction Subagent Prompt Template
- CalculationService (Backend)
- useInvoices.ts
- QuickCreateItemModal.tsx
- useCatalogs
- ExportItemsModal.tsx
- PaymentDetailTabs.tsx
- drawer.tsx
- navigation-menu.tsx
- exports.md Reference Guide
- ReportsSections.tsx
- CertificateList.tsx
- ItemFilterChips.tsx
- chart.tsx
- pagination.tsx
- --update / --cluster-only subcommands (SKILL.md pointer)
- NewReturnForm
- softwares.ts
- ItemDetailView.tsx
- /graphify Full Pipeline
- graphify Knowledge Graph System
- query.md Reference Guide
- CompanySummaryCard.tsx
- skeleton.tsx
- toggle-group.tsx
- tenant.ts
- update.md Reference Guide
- widget.interface.ts
- invoices/page.tsx
- cotizaciones/page.tsx
- package.json
- useAuth
- github-and-merge.md Reference Guide
- AddGraphMenu.tsx
- breadcrumb.tsx
- PaymentDetailInfo.tsx
- catalogCache.ts
- hooks.md Reference Guide
- transcribe.md Reference Guide
- Next.js Project (create-next-app bootstrap)
- MonthSelector.tsx
- CuentasPorCobrarWidget.tsx
- CuentasPorPagarWidget.tsx
- PaymentInvoicesList.tsx
- invoice/InvoiceItemsTable.tsx
- InvoiceDetailPage
- alert.tsx
- next.config.ts
- contacts/layout.tsx
- dashboard/layout.tsx
- invoices/layout.tsx
- invoices/new/layout.tsx
- items/layout.tsx
- payments/new/layout.tsx
- EmptyDashboardState.tsx
- EmptyStateWidget.tsx
- ProductosVendidosSimpleWidget.tsx
- DocumentTitleUpdater.tsx
- Loader.tsx
- proxy.ts
- class-variance-authority
- clsx
- input-otp.tsx
- DeleteWidgetDialog.tsx
- @dnd-kit/core
- @dnd-kit/modifiers
- @dnd-kit/sortable
- @dnd-kit/utilities
- embla-carousel-react
- eslint.config.mjs
- geist
- @hookform/resolvers
- html2canvas
- input-otp
- ClientesConVentasWidget.tsx
- next
- DevolucionesWidget.tsx
- radix-ui
- @radix-ui/react-accordion
- ImpuestosWidget.tsx
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- SolutionsPopover.tsx
- @radix-ui/react-label
- @radix-ui/react-progress
- dayjs
- next-themes
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react-day-picker
- react-dom
- react-qr-code
- react-resizable-panels
- recharts
- sonner
- react-hook-form
- tailwind-merge
- tailwindcss-animate
- @tanstack/query-sync-storage-persister
- @radix-ui/react-switch
- @tanstack/react-query-persist-client
- @tanstack/react-table
- vaul
- zod
- postcss.config.mjs
- afleones (User/Author Persona)
- globals.css.d.ts
- global.d.ts
- newInvoiceMockData.ts
- FactuCore Logo
- Login Page Illustration (Facturación Electrónica)
- @tabler/icons-react
- @tanstack/react-query

## God Nodes (most connected - your core abstractions)
1. `cn()` - 198 edges
2. `showToast()` - 149 edges
3. `cn()` - 139 edges
4. `react` - 114 edges
5. `Button()` - 82 edges
6. `ApiResponse` - 49 edges
7. `DialogContent()` - 48 edges
8. `DialogTitle()` - 48 edges
9. `Dialog()` - 47 edges
10. `useCatalogs()` - 47 edges

## Surprising Connections (you probably didn't know these)
- `CertificatesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/certificates/page.tsx → package.json
- `SoftwarePage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/software/page.tsx → package.json
- `ContactPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/contacts/page.tsx → package.json
- `QuotesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/cotizaciones/page.tsx → package.json
- `InvoicesPage()` --references--> `react`  [EXTRACTED]
  src/app/(authenticated)/invoices/page.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Modular Reference-Doc Loading Pattern** — claude_skills_graphify_skill_step0_github_merge, claude_skills_graphify_skill_step2_5_transcribe, claude_skills_graphify_skill_part_b_semantic_extraction, claude_skills_graphify_skill_update_cluster_only, claude_skills_graphify_skill_query_flow, claude_skills_graphify_skill_add_watch_flow, claude_skills_graphify_skill_hooks_integration, claude_skills_graphify_skill_exports_flow [INFERRED 0.85]
- **Self-Improving Query Feedback Loop (save-result + reflect)** — claude_skills_graphify_references_query_query_command, claude_skills_graphify_references_query_path_command, claude_skills_graphify_references_query_explain_command, claude_skills_graphify_references_query_save_result_command, claude_skills_graphify_references_query_reflect_command [EXTRACTED 1.00]
- **Incremental Update Manifest & Merge Integrity Guards** — claude_skills_graphify_references_update_update_flag, claude_skills_graphify_references_update_build_merge_function, claude_skills_graphify_skill_step9_cleanup_report [INFERRED 0.75]
- **Credit Note Types Using Line-Level Adjustments with CalculationService** — payload_examples_type1, payload_examples_type3, payload_examples_type4, payload_examples_type5, payload_examples_calculation_service [INFERRED 0.85]
- **graphify CLI Subcommands** — claude_md_graphify_query, claude_md_graphify_path, claude_md_graphify_explain, claude_md_graphify_update [EXTRACTED 1.00]

## Communities (185 total, 73 thin omitted)

### Community 0 - "NewReturnForm.tsx"
Cohesion: 0.21
Nodes (19): CertificateListProps, ContactTableBodyProps, InvoiceDetailDocumentProps, DianStatusBadge(), QuoteDetailDocument(), QuoteDetailDocumentProps, RemissionDetailDocument(), RemissionDetailDocumentProps (+11 more)

### Community 1 - "tooltip.tsx"
Cohesion: 0.10
Nodes (26): FlujoTransaccionesData, FlujoTransaccionesWidgetProps, ClienteItem, MejoresClientesWidgetProps, TotalVentasWidgetProps, VentasData, InvoiceDianStatusProps, ComboProductEntry (+18 more)

### Community 2 - "dialog.tsx"
Cohesion: 0.08
Nodes (33): AttributeModalProps, NewCertificateModalProps, ConfigCostCentersModalProps, DOCUMENT_TYPES, CostCenter, NewCostCenterModalProps, CreateCurrencyModalProps, ProductGalleryModalProps (+25 more)

### Community 3 - "AdvancedOptionsSection.tsx"
Cohesion: 0.12
Nodes (11): NewCertificateForm(), ContactDetailBranchesProps, QuoteExportModal(), QuotePageHeaderProps, StatusBadge(), QuoteDetailHeader(), QuoteDetailHeaderProps, FilterOption (+3 more)

### Community 4 - "Sidebar.tsx"
Cohesion: 0.07
Nodes (30): AuthenticatedLayout(), LoginPage(), RootPage(), Header(), Logo(), CollapseButton(), MenuItem(), MenuItemProps (+22 more)

### Community 5 - "NewQuoteSettingsDrawer.tsx"
Cohesion: 0.10
Nodes (33): CategoryModalProps, NewCategoryModal(), NewCostCenterModal(), NewCurrencyModal(), BLANK_BASIC, QuickCreateItemModalProps, ItemType, NewItemModal() (+25 more)

### Community 6 - "invoice/table/columns.tsx"
Cohesion: 0.21
Nodes (12): NewCertificateFormProps, InvoiceDetailHeaderProps, NewSoftwareFormProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription() (+4 more)

### Community 7 - "cn"
Cohesion: 0.06
Nodes (40): AlertDialogOverlay(), Avatar(), AvatarFallback(), AvatarImage(), CommandDialog(), CommandSeparator(), CommandShortcut(), DialogOverlay() (+32 more)

### Community 8 - "sidebar.tsx"
Cohesion: 0.06
Nodes (35): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+27 more)

### Community 9 - "NewReturnForm.backup.tsx"
Cohesion: 0.15
Nodes (9): DOCUMENT_TYPES, DocumentType, envs, DateRangeExportResult, exportByDateRange(), extractFilenameFromContentDisposition(), extractJsonMessage(), QuoteFindAllSuccess (+1 more)

### Community 10 - "QuoteTable.tsx"
Cohesion: 0.06
Nodes (41): FacturasVentaViewProps, QuotesPage(), FacturasVentaViewProps, QuotesPage(), defaultFilterOptions, QuoteFilter(), QuotePageHeader(), QuoteTable() (+33 more)

### Community 11 - "ApiResponse"
Cohesion: 0.12
Nodes (10): ApiClient, AttributePayload, attributesApi, categoriesApi, currenciesApi, PaymentTermsService, priceListsApi, CreateSoftwarePayload (+2 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.12
Nodes (21): DashboardPage(), isPredefinedWidget(), PREDEFINED_POSITIONS, SortableWidgetProps, Widget, DevolucionesWidget(), DevolucionesWidgetProps, FlujoTransaccionesWidget() (+13 more)

### Community 13 - "auth-context.tsx"
Cohesion: 0.09
Nodes (18): metadata, AccountSwitcher(), AccountSwitcherProps, HelpCenterPopover(), HelpCenterPopoverProps, NewPaymentForm(), CompanyData, CompanyHeaderPdfStyle() (+10 more)

### Community 14 - "button.tsx"
Cohesion: 0.11
Nodes (24): ContactDetailHeaderProps, CostCenterFilterProps, FilterOption, HeaderProps, FilterOption, InvoiceFilterProps, InvoicePageHeaderProps, NewInvoiceFooter() (+16 more)

### Community 15 - "devDependencies"
Cohesion: 0.06
Nodes (31): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, shadcn (+23 more)

### Community 16 - "useResolutions"
Cohesion: 0.29
Nodes (11): EditResolutionPage(), NewResolutionPage(), EditResolutionModalProps, baseSchema, formSchema, ResolutionForm(), ResolutionFormProps, useResolutions() (+3 more)

### Community 17 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 18 - "showToast"
Cohesion: 0.33
Nodes (6): NewItemPage(), FormState, ItemsPage(), useCreateItem(), ToggleStatusParams, useToggleItemStatus()

### Community 19 - "types/items.ts"
Cohesion: 0.08
Nodes (30): Image, BaseItemBasicInfo, BaseItemPayload, ComboBasicInfo, ComboItemPayload, CreateItemAccounting, CreateItemComboComponent, CreateItemComboSettings (+22 more)

### Community 20 - "NewRemissionMain.tsx"
Cohesion: 0.18
Nodes (15): NewInvoicePage(), ResolutionsPage(), getSession(), SessionData, NewInvoiceHeader(), NewInvoiceHeaderProps, NewInvoiceMain(), NewInvoiceOptions() (+7 more)

### Community 21 - "components.json"
Cohesion: 0.08
Nodes (23): aliases, components, hooks, lib, ui, utils, Authorization, iconLibrary (+15 more)

### Community 22 - "CreditNotesService"
Cohesion: 0.20
Nodes (5): ReturnDetailPage(), CREDIT_NOTE_KEY(), useCreditNote(), useSendCreditNote(), CreditNotesService

### Community 23 - "ReturnsTableBody.tsx"
Cohesion: 0.16
Nodes (11): FilterOption, RETURN_FILTER_OPTIONS, ReturnsFilterChips(), ReturnsFilterChipsProps, ReturnsTableProps, ReturnsTableBody(), ReturnsTableBodyProps, ReturnsTablePagination() (+3 more)

### Community 24 - "CostCenterTable.tsx"
Cohesion: 0.11
Nodes (21): CostCentersPage(), ConfigCostCentersModal(), CostCenterTable(), CostCenterTableProps, ServerPagination, CostCenter, getColumns(), CostCenterFilter() (+13 more)

### Community 25 - "lib/utils.ts"
Cohesion: 0.18
Nodes (18): CustomFieldModalProps, FALLBACK_FIELD_TYPES, AsyncSearchableSelectOption, AsyncSearchableSelectProps, Calendar(), CalendarDayButton(), Command(), CommandEmpty() (+10 more)

### Community 26 - "invoices/new/page.tsx"
Cohesion: 0.13
Nodes (24): EditQuotePage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), PreviewModal(), PreviewModalProps, NewQuoteFooter(), NewQuoteHeader(), NewQuoteHeaderProps (+16 more)

### Community 27 - "ui/utils.ts"
Cohesion: 0.10
Nodes (12): HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Slider(), Switch(), Textarea(), ToggleGroup() (+4 more)

### Community 28 - "PaymentTable.tsx"
Cohesion: 0.12
Nodes (20): PaymentsPage(), PaymentTable(), PaymentTableProps, SelectionState, ServerPagination, getPaymentColumns(), filterLabels, MOCK_BANK_ACCOUNTS (+12 more)

### Community 29 - "react"
Cohesion: 0.10
Nodes (25): react, react, AttributeModal(), CustomFieldModal(), FormattedInput(), FormattedInput(), FormattedInput(), AccountingSection() (+17 more)

### Community 30 - "QuoteItemsTable.tsx"
Cohesion: 0.12
Nodes (36): AddContactModal(), ContactAccountingInfoProps, ContactCommercialInfoProps, EditResolutionModal(), InvoiceItemsTable(), QuickCreateItemModal(), ProductComboModal(), ProductComboModalProps (+28 more)

### Community 31 - "quote.ts"
Cohesion: 0.19
Nodes (6): RemissionDetailPage(), RemissionDetailExtraInfo(), RemissionDetailExtraInfoProps, RemissionDetailSkeleton(), RemissionDetailSummary(), RemissionDetailSummaryProps

### Community 32 - "useQuotes.ts"
Cohesion: 0.10
Nodes (18): QuoteDetailPage(), NewQuotePage(), ActionsCell(), QuoteDetailExtraInfo(), QuoteDetailExtraInfoProps, QuoteDetailSkeleton(), QuoteDetailSummary(), QuoteDetailSummaryProps (+10 more)

### Community 33 - "InvoicesService"
Cohesion: 0.20
Nodes (3): InvoiceDetailPage(), InvoicesService, Invoice

### Community 34 - "remission.ts"
Cohesion: 0.07
Nodes (38): FacturasVentaViewProps, RemissionsPage(), defaultFilterOptions, RemissionFilter(), RemissionTable(), RemissionTableProps, ServerPagination, getColumns() (+30 more)

### Community 35 - "contacts/page.tsx"
Cohesion: 0.07
Nodes (31): Contact, ContactPage(), ContactType, ReturnsPage(), Contact, ContactTable(), ContactTableProps, SelectionState (+23 more)

### Community 36 - "items/[id]/page.tsx"
Cohesion: 0.16
Nodes (11): EditItemPage(), ItemDetailPage(), ItemAccounting(), ItemAttachments(), ItemHeader(), ItemInventory(), ItemInventoryProps, useDeleteItem() (+3 more)

### Community 37 - "invoice.ts"
Cohesion: 0.14
Nodes (13): AllowanceCharge, InvoiceBill, InvoiceBillingPeriod, InvoiceCompany, InvoiceCustomer, InvoiceDian, InvoiceEstablishment, InvoiceFindAllEmpty (+5 more)

### Community 38 - "cn"
Cohesion: 0.09
Nodes (34): ItemImage, StatusToggle(), InfoChip(), InfoField(), StatusToggle(), TabButton(), ImageUploader(), ImageUploaderProps (+26 more)

### Community 39 - "NewItemModal.tsx"
Cohesion: 0.20
Nodes (10): InvoiceStats, StatCard(), StatCardProps, Card(), CardAction(), CardContent(), CardDescription(), CardFooter() (+2 more)

### Community 40 - "contacts/[id]/page.tsx"
Cohesion: 0.17
Nodes (11): ContactDetailPage(), ContactDetailAttachments(), ContactDetailAttachmentsProps, ContactDetailBranches(), ContactDetailComments(), ContactDetailCommentsProps, ContactDetailHeader(), ContactDetailTabs() (+3 more)

### Community 41 - "returns/[id]/page.tsx"
Cohesion: 0.20
Nodes (11): PaymentDetailAccountingAccounts(), PaymentDetailAccountingAccountsProps, ReturnDetailDocument(), ReturnDetailHeader(), ReturnDetailSkeleton(), ReturnDetailSummary(), ReturnDetailSummaryProps, ReturnDetailTabs() (+3 more)

### Community 42 - "ResolutionTable.tsx"
Cohesion: 0.16
Nodes (12): ResolutionTable(), ResolutionTableProps, ServerPagination, getResolutionColumns(), ResolutionFilterChips(), ResolutionTableBody(), ResolutionTableBodyProps, ResolutionTablePagination() (+4 more)

### Community 43 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 44 - "types/catalogs.ts"
Cohesion: 0.36
Nodes (10): ItemRow(), ItemRow(), ItemRow(), getComboAvailableUnits(), getComboComponents(), isComboItem(), isServiceItem(), requiresOwnStockCheck() (+2 more)

### Community 45 - "AddContactModal.tsx"
Cohesion: 0.12
Nodes (23): EditContactContent(), NewContactContent(), AddContactModalProps, ModalContent(), PrefilledContactData, ContactAccountingInfo(), ContactAdvancedForm(), ContactAdvancedFormProps (+15 more)

### Community 46 - "payments/[id]/page.tsx"
Cohesion: 0.28
Nodes (4): PaymentDetailPage(), NewPaymentPage(), usePayment(), PaymentsService

### Community 47 - "tasks/page.tsx"
Cohesion: 0.16
Nodes (10): NewTaskDrawer(), NewTaskDrawerProps, ASSIGNEE_OPTIONS, FILTER_TABS, PRIORITY_OPTIONS, STATUS_OPTIONS, TaskFiltersPopup(), TaskFiltersPopupProps (+2 more)

### Community 48 - "ItemTable.tsx"
Cohesion: 0.11
Nodes (20): ItemTable(), ItemTableProps, SelectionState, ServerPagination, getItemColumns(), filterLabels, ItemFilterChips(), ItemFilterChipsProps (+12 more)

### Community 49 - "invoices/[id]/page.tsx"
Cohesion: 0.14
Nodes (10): InvoiceDetailDocument(), InvoiceDetailExtraInfo(), InvoiceDetailExtraInfoProps, InvoiceDetailHeader(), InvoiceDetailSkeleton(), InvoiceDetailSummary(), InvoiceDetailSummaryProps, InvoiceDetailTabs() (+2 more)

### Community 50 - "invoice/table/FilterChips.tsx"
Cohesion: 0.29
Nodes (6): FilterOption, paymentFilterOptions, PaymentTableToolbar(), PaymentTableToolbarProps, DebouncedInput(), DebouncedInputProps

### Community 51 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 52 - "dependencies"
Cohesion: 0.15
Nodes (13): axios, dayjs, lucide-react, next-themes, dependencies, axios, dayjs, lucide-react (+5 more)

### Community 53 - "InvoiceTable.tsx"
Cohesion: 0.13
Nodes (19): defaultFilterOptions, InvoiceTableProps, ServerPagination, FilterChips(), FilterChipsProps, filterIcons, filterLabels, filterValueToColumnId (+11 more)

### Community 54 - "remissions/[id]/edit/page.tsx"
Cohesion: 0.12
Nodes (26): EditRemissionPage(), parseDDMMYYYYToDate(), parseDDMMYYYYToISO(), NewRemissionPage(), NewRemissionFooter(), NewRemissionHeader(), NewRemissionHeaderProps, GlobalAdjustment (+18 more)

### Community 55 - "AuthService"
Cohesion: 0.35
Nodes (10): formatMoney(), getClientName(), getDocDate(), getDocNumber(), getDocStatus(), getDocTotal(), ItemDocumentsTab(), resolveDoc() (+2 more)

### Community 56 - "ResolutionForm.tsx"
Cohesion: 0.13
Nodes (19): ContactDetailGeneral(), ContactDetailGeneralProps, ExportConfig, ExportItemsModal(), ExportItemsModalProps, FormControl(), FormDescription(), FormField() (+11 more)

### Community 57 - "Extraction Subagent Prompt Template"
Cohesion: 0.18
Nodes (11): Confidence Score Rubric (EXTRACTED/INFERRED/AMBIGUOUS), extraction-spec.md Reference Guide, Hyperedge Extraction Rule, Node ID Format Spec ({stem}_{entity}), semantically_similar_to Edge Rule, Extraction Subagent Prompt Template, Honesty Rules, Part A: Structural (AST) extraction (+3 more)

### Community 58 - "CalculationService (Backend)"
Cohesion: 0.42
Nodes (11): CalculationService (Backend), Rationale: Frontend Must Not Send Monetary Amounts, credit_note_reference_index field, POST /api/credit-notes endpoint, POST /api/credit-notes/send endpoint, Tipo 1: Devolución Parcial (Ajuste de Cantidad), Tipo 2: Anulación Completa de la Factura, Tipo 3 y 6: Rebaja / Descuento a Líneas (+3 more)

### Community 59 - "useInvoices.ts"
Cohesion: 0.23
Nodes (10): InvoiceEditPage(), INVOICE_KEY(), INVOICES_KEY, useInvoice(), usePrefetchInvoiceDetail(), useSendInvoice(), useUpdateInvoice(), InvoiceDetailResponse (+2 more)

### Community 60 - "QuickCreateItemModal.tsx"
Cohesion: 0.22
Nodes (8): TabConfig, InfoChip(), ItemMainInfo(), ItemMainInfoProps, ItemPriceLists(), ItemPriceListsProps, ProductGalleryModal(), ItemResponse

### Community 61 - "useCatalogs"
Cohesion: 0.25
Nodes (5): NewInvoiceComments(), NewWithholdingModal(), CREDIT_NOTES_KEY, useCreditNotesList(), CreditNoteType

### Community 62 - "ExportItemsModal.tsx"
Cohesion: 0.25
Nodes (6): UseItemsParams, PaginatedData, GetItemByIdResponse, ItemsListApiData, UpdateItemPayload, UpdateVariantPayload

### Community 63 - "PaymentDetailTabs.tsx"
Cohesion: 0.47
Nodes (3): PaymentDetailAccounting(), PaymentDetailAdvances(), PaymentDetailTabsProps

### Community 64 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 65 - "navigation-menu.tsx"
Cohesion: 0.40
Nodes (5): ActionsCell(), isRemissionInvoiced(), StatusBadge(), RemissionDetailHeader(), RemissionDetailHeaderProps

### Community 66 - "exports.md Reference Guide"
Cohesion: 0.22
Nodes (9): Token reduction benchmark (Step 8), --falkordb / --falkordb-push export (Step 7a), --graphml export (Step 7c), exports.md Reference Guide, --mcp MCP stdio server (Step 7d), --neo4j / --neo4j-push export (Step 7), --svg export (Step 7b), --wiki export (Step 6b) (+1 more)

### Community 67 - "ReportsSections.tsx"
Cohesion: 0.33
Nodes (5): CategoryCard(), CategoryCardProps, ReportsCategoryGrid(), ReportsHeader(), ReportsSearchBar()

### Community 68 - "CertificateList.tsx"
Cohesion: 0.40
Nodes (4): CertificatesPage(), CertificateList(), NewCertificateModal(), certificatesApi

### Community 70 - "chart.tsx"
Cohesion: 0.16
Nodes (15): DistribucionGastosWidget(), DistribucionGastosWidgetProps, GastoItem, ProductoItem, ProductosMasVendidosWidget(), ProductosMasVendidosWidgetProps, ChartConfig, ChartContainer() (+7 more)

### Community 71 - "pagination.tsx"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 72 - "--update / --cluster-only subcommands (SKILL.md pointer)"
Cohesion: 0.29
Nodes (7): /graphify add <url>, add-watch.md Reference Guide, --watch (background folder watcher), /graphify add and --watch flow (SKILL.md pointer), Interpreter guard for subcommands, /graphify query flow (SKILL.md pointer), --update / --cluster-only subcommands (SKILL.md pointer)

### Community 73 - "NewReturnForm"
Cohesion: 0.32
Nodes (3): NewReturnForm(), createEmptyLine(), NewReturnForm()

### Community 74 - "softwares.ts"
Cohesion: 0.40
Nodes (4): SoftwarePage(), NewSoftwareModal(), SoftwareList(), softwaresApi

### Community 75 - "ItemDetailView.tsx"
Cohesion: 0.60
Nodes (4): formatMoney(), getItemTypeName(), ItemDetailView(), ItemDetailViewProps

### Community 76 - "/graphify Full Pipeline"
Cohesion: 0.29
Nodes (7): graphify Skill Auto-Trigger Rule, /graphify Full Pipeline, Step 1: Ensure graphify is installed, Step 2: Detect files, Step 5: Label communities, Step 6: Generate Obsidian vault + HTML, Step 9: Save manifest, update cost tracker, clean up, report

### Community 77 - "graphify Knowledge Graph System"
Cohesion: 0.29
Nodes (7): GRAPH_REPORT.md, graphify Knowledge Graph System, graphify explain command, graphify path command, graphify query command, graphify update command, graphify-out/wiki/index.md

### Community 78 - "query.md Reference Guide"
Cohesion: 0.52
Nodes (7): graphify explain "NODE_NAME", query.md Reference Guide, graphify path "A" "B", graphify query "<question>", graphify reflect / LESSONS.md, graphify save-result (work memory), Constrained Query Expansion (Step 0)

### Community 79 - "CompanySummaryCard.tsx"
Cohesion: 0.15
Nodes (11): Factucore Horizontal Logo, FactucoreLogo(), FactucoreLogoProps, CompanySummaryCard(), ConfigCard(), ConfigCardProps, ConfigLink, ConfigurationGrid() (+3 more)

### Community 80 - "skeleton.tsx"
Cohesion: 0.47
Nodes (3): WidgetSkeleton(), WidgetSkeletonProps, Skeleton()

### Community 81 - "toggle-group.tsx"
Cohesion: 0.40
Nodes (3): AccordionContent(), AccordionItem(), AccordionTrigger()

### Community 82 - "tenant.ts"
Cohesion: 0.29
Nodes (6): CreateTenantInput, createTenantSchema, Tenant, tenantSchema, UpdateTenantInput, updateTenantSchema

### Community 83 - "update.md Reference Guide"
Cohesion: 0.33
Nodes (6): build_merge() / graph_diff(), --cluster-only, update.md Reference Guide, --update (incremental re-extraction), Step 4.5: Graph health check, Step 4: Build graph, cluster, analyze, generate outputs

### Community 84 - "widget.interface.ts"
Cohesion: 0.33
Nodes (3): DashboardViewProps, SortableWidgetProps, Widget

### Community 85 - "invoices/page.tsx"
Cohesion: 0.33
Nodes (6): FacturasVentaViewProps, InvoicesPage(), InvoicePageHeader(), InvoiceTable(), getColumns(), useInvoicesList()

### Community 89 - "github-and-merge.md Reference Guide"
Cohesion: 0.60
Nodes (5): graphify clone <github-url>, github-and-merge.md Reference Guide, graphify merge-graphs, Monorepo / multi-subfolder merge flow, Step 0: GitHub repos and multi-path merge

### Community 90 - "AddGraphMenu.tsx"
Cohesion: 0.40
Nodes (4): AddGraphMenu(), AddGraphMenuProps, allGraphOptions, GraphOption

### Community 91 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 92 - "PaymentDetailInfo.tsx"
Cohesion: 0.17
Nodes (10): Attachment, PaymentDetailAttachments(), PaymentDetailAttachmentsProps, PaymentDetailHeader(), PaymentDetailInfo(), PaymentDetailInfoProps, PaymentDetailTabs(), PaymentDetailTotal() (+2 more)

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

### Community 100 - "PaymentInvoicesList.tsx"
Cohesion: 0.40
Nodes (5): parseDateSafe(), PaymentInvoicesList(), PaymentInvoicesListProps, WithholdingEntry, PopoverAnchor()

### Community 104 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 115 - "ProductosVendidosSimpleWidget.tsx"
Cohesion: 0.27
Nodes (4): ClientesConVentasWidget(), ClientesConVentasWidgetProps, ProductosVendidosSimpleWidget(), ProductosVendidosSimpleWidgetProps

### Community 121 - "input-otp.tsx"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

## Knowledge Gaps
- **550 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+545 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **73 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `tooltip.tsx`, `AdvancedOptionsSection.tsx`, `Sidebar.tsx`, `NewQuoteSettingsDrawer.tsx`, `sidebar.tsx`, `QuoteTable.tsx`, `dashboard/page.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `ReturnsTableBody.tsx`, `CostCenterTable.tsx`, `lib/utils.ts`, `invoices/new/page.tsx`, `ui/utils.ts`, `PaymentTable.tsx`, `QuoteItemsTable.tsx`, `useQuotes.ts`, `remission.ts`, `contacts/page.tsx`, `items/[id]/page.tsx`, `cn`, `ResolutionTable.tsx`, `payments/[id]/page.tsx`, `ItemTable.tsx`, `invoices/[id]/page.tsx`, `invoice/table/FilterChips.tsx`, `carousel.tsx`, `dependencies`, `InvoiceTable.tsx`, `AuthService`, `ResolutionForm.tsx`, `QuickCreateItemModal.tsx`, `useCatalogs`, `navigation-menu.tsx`, `CertificateList.tsx`, `chart.tsx`, `softwares.ts`, `ItemDetailView.tsx`, `invoices/page.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `showToast()` connect `invoices/new/page.tsx` to `tooltip.tsx`, `dialog.tsx`, `AdvancedOptionsSection.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `QuoteTable.tsx`, `dashboard/page.tsx`, `auth-context.tsx`, `button.tsx`, `useResolutions`, `showToast`, `NewRemissionMain.tsx`, `CreditNotesService`, `CostCenterTable.tsx`, `lib/utils.ts`, `PaymentTable.tsx`, `react`, `QuoteItemsTable.tsx`, `quote.ts`, `useQuotes.ts`, `InvoicesService`, `items/[id]/page.tsx`, `cn`, `contacts/[id]/page.tsx`, `returns/[id]/page.tsx`, `types/catalogs.ts`, `AddContactModal.tsx`, `payments/[id]/page.tsx`, `invoices/[id]/page.tsx`, `remissions/[id]/edit/page.tsx`, `useCatalogs`, `navigation-menu.tsx`, `NewReturnForm`, `PaymentInvoicesList.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `tooltip.tsx`, `dialog.tsx`, `NewQuoteSettingsDrawer.tsx`, `invoice/table/columns.tsx`, `sidebar.tsx`, `button.tsx`, `lib/utils.ts`, `ui/utils.ts`, `QuoteItemsTable.tsx`, `NewItemModal.tsx`, `context-menu.tsx`, `carousel.tsx`, `ResolutionForm.tsx`, `drawer.tsx`, `chart.tsx`, `pagination.tsx`, `toggle-group.tsx`, `package.json`, `breadcrumb.tsx`, `alert.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _550 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tooltip.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09877551020408164 - nodes in this community are weakly interconnected._
- **Should `dialog.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08461538461538462 - nodes in this community are weakly interconnected._
- **Should `AdvancedOptionsSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._