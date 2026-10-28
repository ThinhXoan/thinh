import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { emitPrimaryAction } from '@/lib/events';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { LoginPage } from '@/pages/auth/LoginPage';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Sidebar, type PageId } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { OrdersPage } from '@/pages/orders/OrdersPage';
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { WarehousesPage } from '@/pages/warehouses/WarehousesPage';
import { TransfersPage } from '@/pages/transfers/TransfersPage';
import { BatchesPage } from '@/pages/batches/BatchesPage';
import { StockLedgerPage } from '@/pages/stockLedger/StockLedgerPage';
import { PurchaseOrdersPage } from '@/pages/purchaseOrders/PurchaseOrdersPage';
import { ChannelMappingPage } from '@/pages/channelMapping/ChannelMappingPage';
import { ChannelConnectionsPage } from '@/pages/channelConnections/ChannelConnectionsPage';
import { SyncMonitorPage } from '@/pages/syncMonitor/SyncMonitorPage';
import { FulfillmentPage } from '@/pages/fulfillment/FulfillmentPage';
import { ReturnsPage } from '@/pages/returns/ReturnsPage';
import { LedgerPage } from '@/pages/ledger/LedgerPage';
import { FeeReconciliationPage } from '@/pages/feeReconciliation/FeeReconciliationPage';
import { MarginControlPage } from '@/pages/marginControl/MarginControlPage';
import { ComplaintsPage } from '@/pages/complaints/ComplaintsPage';
import { AuditTrailPage } from '@/pages/auditTrail/AuditTrailPage';
import { AutomationRulesPage } from '@/pages/automationRules/AutomationRulesPage';
import { WebhooksPage } from '@/pages/webhooks/WebhooksPage';
import { SimulatorPage } from '@/pages/simulator/SimulatorPage';
import { SalesVelocityPage } from '@/pages/salesVelocity/SalesVelocityPage';
import { RevenueReportPage } from '@/pages/revenueReport/RevenueReportPage';
import { BufferRulesPage } from '@/pages/bufferRules/BufferRulesPage';
import { RoutingRulesPage } from '@/pages/routingRules/RoutingRulesPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { FlowGuidePage } from '@/pages/flowGuide/FlowGuidePage';

interface PageMeta {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  primaryLabel: string;
}

const PAGE_META: Record<PageId, PageMeta> = {
  dashboard: { title: 'Dashboard', subtitle: 'Tong quan hoat dong & phan tich', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
  orders: { title: 'Don hang', subtitle: 'Trung tam don hang da kenh — giao hang da kho', searchPlaceholder: 'Tim theo ma don hoac khach hang...', primaryLabel: 'Tao don' },
  customers: { title: 'Khach hang', subtitle: 'CRM thong nhat voi diem thuong & RFM', searchPlaceholder: 'Tim theo ten, email, hoac cong ty...', primaryLabel: 'Them khach hang' },
  complaints: { title: 'Khieu nai & AI', subtitle: 'Phan tich khieu nai an toan PII voi AI sentiment', searchPlaceholder: 'Tim khieu nai...', primaryLabel: 'Tao khieu nai' },
  returns: { title: 'Doi tra / RMA', subtitle: 'Quan ly doi tra va hoan tien', searchPlaceholder: 'Tim theo ma RMA hoac don hang...', primaryLabel: 'Tao yeu cau' },
  products: { title: 'San pham & BOM', subtitle: 'Danh muc voi combo/bundle & da kho', searchPlaceholder: 'Tim theo ten, SKU, hoac danh muc...', primaryLabel: 'Them san pham' },
  inventory: { title: 'Ton kho 5 trang thai', subtitle: 'Physical, Reserved, Available, Unavailable, Incoming', searchPlaceholder: 'Tim theo san pham hoac SKU...', primaryLabel: '' },
  warehouses: { title: 'Kho & Bin', subtitle: 'Quan ly da kho voi vi tri bin', searchPlaceholder: 'Tim kho...', primaryLabel: 'Them kho' },
  transfers: { title: 'Chuyen kho', subtitle: 'Chuyen kho lien chi nhanh theo doi trang thai', searchPlaceholder: 'Tim phieu chuyen...', primaryLabel: 'Tao phieu' },
  batches: { title: 'Lo & Serial', subtitle: 'Theo doi lo FEFO & Serial/IMEI', searchPlaceholder: 'Tim theo ma lo hoac serial...', primaryLabel: '' },
  stockLedger: { title: 'So giao dich ton', subtitle: 'Lich su giao dich ton kho bat bien', searchPlaceholder: 'Tim giao dich...', primaryLabel: '' },
  purchaseOrders: { title: 'Don mua hang', subtitle: 'Quan ly PO voi dat truoc & hang sap ve', searchPlaceholder: 'Tim theo ma PO hoac nha cung cap...', primaryLabel: 'Tao PO' },
  channelMapping: { title: 'Anh xa SKU kenh', subtitle: 'Anh xa SKU noi bo sang SKU kenh TMĐT', searchPlaceholder: 'Tim anh xa...', primaryLabel: 'Them anh xa' },
  channelConnections: { title: 'Ket noi kenh', subtitle: 'Quan ly ket noi shop Shopee, TikTok, Lazada', searchPlaceholder: 'Tim ket noi...', primaryLabel: 'Them ket noi' },
  syncMonitor: { title: 'Giam sat dong bo', subtitle: 'Trang thai day ton kho & log retry', searchPlaceholder: 'Tim log...', primaryLabel: '' },
  fulfillment: { title: 'Wave Picking & SLA', subtitle: 'Wave picking, SLA countdown, scan-to-pack', searchPlaceholder: 'Tim wave...', primaryLabel: 'Tao wave' },
  ledger: { title: 'So kep', subtitle: 'Bút toan kep voi Debit == Credit', searchPlaceholder: 'Tim but toan...', primaryLabel: 'Tao but toan' },
  feeReconciliation: { title: 'Doi soát phi', subtitle: 'Phan tich phi chi tiet & phat hien chenh lech', searchPlaceholder: 'Tim theo ma don...', primaryLabel: '' },
  marginControl: { title: 'Marg Circuit Breaker', subtitle: 'Tu dong ngat khi phat hien margin am', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
  salesVelocity: { title: 'Van toc ban', subtitle: 'Bao cao doanh thu, loi nhuan, van toc ban', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
  revenueReport: { title: 'Bao cao doanh thu', subtitle: 'Phan tich doanh thu theo ngay, thang, nam', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
  auditTrail: { title: 'Nhat ky Audit', subtitle: 'Nhat ky SHA-256 chong xoa', searchPlaceholder: 'Tim nhat ky...', primaryLabel: '' },
  automationRules: { title: 'Luat tu dong', subtitle: 'Tu dong hoa don hang IF-THEN', searchPlaceholder: 'Tim luat...', primaryLabel: 'Tao luat' },
  webhooks: { title: 'Outbound Webhooks', subtitle: 'Sự kiện HMAC gui he thong ben ngoai', searchPlaceholder: 'Tim webhook...', primaryLabel: 'Them webhook' },
  simulator: { title: 'Chaos Simulator', subtitle: 'Flash sale, duplicate webhook, margin attack', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
  bufferRules: { title: 'Ton kho an toan', subtitle: 'Cau hinh safety stock & reorder point', searchPlaceholder: 'Tim quy tac...', primaryLabel: 'Them quy tac' },
  routingRules: { title: 'Dinh tuyen kho', subtitle: 'Cau hinh dinh tuyen kho tu dong & tach/gop don', searchPlaceholder: 'Tim quy tac...', primaryLabel: 'Them quy tac' },
  settings: { title: 'Cai dat & Phan quyen', subtitle: 'Quan ly nguoi dung & vai tro RBAC', searchPlaceholder: 'Tim nguoi dung...', primaryLabel: '' },
  flowGuide: { title: 'Luong hoat dong', subtitle: 'Huong dan luong end-to-end & phan quyen', searchPlaceholder: 'Tim kiem...', primaryLabel: '' },
};

function AppInner() {
  const { session, loading: authLoading } = useAuth();
  const [page, setPage] = useState<PageId>('dashboard');
  const [search, setSearch] = useState('');
  const [sidebarStats, setSidebarStats] = useState({ pendingOrders: 0, lowStock: 0 });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function refreshStats() {
    const [ordersRes, productsRes] = await Promise.all([
      supabase.from('orders').select('status').in('status', ['pending', 'processing']),
      supabase.from('products').select('stock, reorder_level, safety_stock'),
    ]);
    setSidebarStats({
      pendingOrders: ordersRes.data?.length ?? 0,
      lowStock: productsRes.data?.filter((p) => p.stock <= (p.reorder_level ?? 10)).length ?? 0,
    });
  }

  useEffect(() => {
    if (!session) return;
    refreshStats();
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [session]);

  function navigate(p: PageId) {
    setPage(p);
    setSearch('');
    setMobileSidebarOpen(false);
  }

  if (authLoading) return <FullPageSpinner label="Dang tai..." />;

  if (!session) return <LoginPage />;

  const meta = PAGE_META[page];
  const showPrimary = page !== 'dashboard' && page !== 'inventory' && page !== 'batches' &&
    page !== 'stockLedger' && page !== 'feeReconciliation' && page !== 'marginControl' &&
    page !== 'auditTrail' && page !== 'simulator' && page !== 'syncMonitor' &&
    page !== 'salesVelocity' && page !== 'revenueReport' && page !== 'settings' &&
    page !== 'flowGuide';

  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar current={page} onNavigate={navigate} stats={sidebarStats} mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          search={search}
          onSearch={setSearch}
          searchPlaceholder={meta.searchPlaceholder}
          onPrimaryAction={showPrimary ? () => emitPrimaryAction(page) : undefined}
          primaryActionLabel={meta.primaryLabel}
          onMobileMenu={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1">
          {page === 'dashboard' && <DashboardPage onNavigate={(p) => navigate(p)} />}
          {page === 'orders' && <OrdersPage search={search} />}
          {page === 'customers' && <CustomersPage search={search} />}
          {page === 'complaints' && <ComplaintsPage search={search} />}
          {page === 'returns' && <ReturnsPage search={search} />}
          {page === 'products' && <ProductsPage search={search} />}
          {page === 'inventory' && <InventoryPage search={search} />}
          {page === 'warehouses' && <WarehousesPage search={search} />}
          {page === 'transfers' && <TransfersPage search={search} />}
          {page === 'batches' && <BatchesPage search={search} />}
          {page === 'stockLedger' && <StockLedgerPage search={search} />}
          {page === 'purchaseOrders' && <PurchaseOrdersPage search={search} />}
          {page === 'channelMapping' && <ChannelMappingPage search={search} />}
          {page === 'channelConnections' && <ChannelConnectionsPage search={search} />}
          {page === 'syncMonitor' && <SyncMonitorPage search={search} />}
          {page === 'fulfillment' && <FulfillmentPage search={search} />}
          {page === 'ledger' && <LedgerPage search={search} />}
          {page === 'feeReconciliation' && <FeeReconciliationPage search={search} />}
          {page === 'marginControl' && <MarginControlPage />}
          {page === 'salesVelocity' && <SalesVelocityPage />}
          {page === 'revenueReport' && <RevenueReportPage />}
          {page === 'auditTrail' && <AuditTrailPage search={search} />}
          {page === 'automationRules' && <AutomationRulesPage search={search} />}
          {page === 'webhooks' && <WebhooksPage search={search} />}
          {page === 'simulator' && <SimulatorPage />}
          {page === 'bufferRules' && <BufferRulesPage search={search} />}
          {page === 'routingRules' && <RoutingRulesPage search={search} />}
          {page === 'settings' && <SettingsPage search={search} />}
          {page === 'flowGuide' && <FlowGuidePage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}
