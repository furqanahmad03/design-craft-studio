'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, Search, Filter, User, Package, Palette, Star, MapPin, Phone, Mail, Clock, ArrowLeft, Eye } from 'lucide-react';
import { Order } from '../../types/Order';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [designTypeFilter, setDesignTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, designTypeFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Design type filter
    if (designTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.designType === designTypeFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDesignTypeIcon = (type: string) => {
    return type === 'custom' ? <Palette className="h-4 w-4" /> : <Package className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                Orders Management
              </h1>
              <p className="text-gray-600 mt-2">
                View and manage all customer orders
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-gray-600" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="designType" className="text-sm font-medium text-gray-700">Design Type</Label>
                <Select value={designTypeFilter} onValueChange={setDesignTypeFilter}>
                  <SelectTrigger className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filter by design" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="premade">Premade</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDesignTypeFilter('all');
                  }}
                  className="w-full border-gray-200 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Orders ({filteredOrders.length} of {orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {orders.length === 0 ? 'No orders have been placed yet.' : 'Try adjusting your filters or search terms.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-[120px] font-semibold text-gray-900">Order ID</TableHead>
                      <TableHead className="w-[200px] font-semibold text-gray-900">Product/Decoration</TableHead>
                      <TableHead className="w-[150px] font-semibold text-gray-900">Customer</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Design</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Quantity/Price</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Total</TableHead>
                      <TableHead className="w-[100px] font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="w-[150px] font-semibold text-gray-900">Date</TableHead>
                      <TableHead className="w-[80px] font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-mono text-sm text-gray-600">
                          {order.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.productName ? (
                            <div>
                              <div className="font-semibold text-gray-900">{order.productName}</div>
                              <div className="text-sm text-blue-600">Product Order</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-semibold text-gray-900">Decoration</div>
                              <div className="text-sm text-purple-600">
                                {order.isCustomDesign ? 'Custom Design' : 'Premade Design'}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDesignTypeIcon(order.designType)}
                            <span className="text-sm capitalize text-gray-700">{order.designType}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.productName ? (
                            <div>
                              <div className="font-medium text-gray-900">{order.quantity}</div>
                              <div className="text-sm text-gray-500">${order.basePrice} each</div>
                            </div>
                          ) : (
                            <div className="text-gray-500">-</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.productName ? (
                            <span className="font-bold text-green-600">${order.totalPrice}</span>
                          ) : (
                            <span className="text-purple-600 font-medium">Custom Design</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openOrderDetails(order)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] min-w-fit overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                Order Details
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-600">
                Complete information for order <span className="font-mono font-semibold text-blue-600">{selectedOrder?.id}</span>
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-8 pt-4">
                {/* Order Summary Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  {/* Order Status Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Order Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Status:</span>
                        <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} border-2 font-semibold`}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium">Date:</span>
                        <span className="font-semibold text-blue-900">{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      {selectedOrder.notes && (
                        <div className="pt-2 border-t border-blue-200">
                          <span className="text-blue-700 font-medium block mb-1">Notes:</span>
                          <span className="text-sm text-blue-800 italic">{selectedOrder.notes}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Customer Details Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">Name:</span>
                        <span className="font-semibold text-green-900">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-medium">Email:</span>
                        <span className="font-semibold text-green-900 break-all">{selectedOrder.customerEmail}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-700 font-medium">Design Type:</span>
                        <span className="font-semibold text-purple-900 capitalize">{selectedOrder.designType}</span>
                      </div>
                      {selectedOrder.totalPrice && (
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700 font-medium">Total:</span>
                          <span className="text-2xl font-bold text-purple-900">${selectedOrder.totalPrice.toFixed(2)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Product & Design Details */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product & Design Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedOrder.productName ? (
                      // Product Order
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Product Name</Label>
                            <p className="text-purple-900 font-medium">{selectedOrder.productName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Product Type</Label>
                            <p className="text-purple-900">{selectedOrder.productType}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Quantity</Label>
                            <p className="text-purple-900 font-medium">{selectedOrder.quantity}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Base Price</Label>
                            <p className="text-purple-900">${selectedOrder.basePrice}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Total Price</Label>
                            <p className="text-purple-900 font-bold text-lg">${selectedOrder.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Decoration Order
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Order Type</Label>
                            <p className="text-purple-900 font-medium">Decoration Order</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-purple-700">Design Type</Label>
                            <Badge variant={selectedOrder.designType === 'custom' ? 'destructive' : 'default'}>
                              {selectedOrder.designType === 'custom' ? 'Custom Design' : 'Premade Design'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-purple-200 pt-4">
                      <Label className="text-sm font-medium text-purple-700">Design Details</Label>
                      <div className="mt-2 space-y-3">
                        {selectedOrder.designType === 'premade' ? (
                          <div>
                            <p className="text-purple-900">
                              <span className="font-medium">Selected Design:</span> {selectedOrder.selectedDesign}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-purple-900 font-medium mb-2">Custom Design</p>
                            {selectedOrder.customImagePath && (
                              <div className="relative">
                                <img 
                                  src={selectedOrder.customImagePath} 
                                  alt="Custom Design" 
                                  className="w-full max-w-md h-auto rounded-lg border-2 border-purple-200 shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const placeholder = document.createElement('div');
                                    placeholder.className = 'w-full max-w-md h-48 bg-gray-100 rounded-lg border-2 border-purple-200 shadow-sm flex items-center justify-center';
                                    placeholder.innerHTML = '<div class="text-center text-gray-500"><Palette class="h-12 w-12 mx-auto mb-2" /><p>Image not available</p></div>';
                                    e.currentTarget.parentNode?.appendChild(placeholder);
                                  }}
                                />
                                <div className="mt-2 text-sm text-purple-600">
                                  <span className="font-medium">File:</span> {selectedOrder.customDesignFile}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Design Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Palette className="h-6 w-6 text-indigo-600" />
                      </div>
                      Design Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Design Type</h4>
                        <div className="flex items-center gap-3">
                          {getDesignTypeIcon(selectedOrder.designType)}
                          <Badge variant="outline" className="text-lg px-4 py-2 capitalize">
                            {selectedOrder.designType}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {selectedOrder.selectedDesign && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Selected Design</h4>
                            <span className="text-gray-700">{selectedOrder.selectedDesign}</span>
                          </div>
                        )}
                        {selectedOrder.customDesignFile && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Custom File</h4>
                            <span className="text-gray-700 font-mono text-sm">{selectedOrder.customDesignFile}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vendor Information */}
                {selectedOrder.vendor ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Vendor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-green-700">Vendor Name</Label>
                          <p className="text-green-900 font-medium">{selectedOrder.vendor.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-700">Rating</Label>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-green-900 font-medium">{selectedOrder.vendor.rating}/5</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-700">Timeline</Label>
                          <p className="text-green-900">{selectedOrder.vendor.timeline}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-700">Phone</Label>
                          <p className="text-green-900">{selectedOrder.vendor.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-green-700">Address</Label>
                        <p className="text-green-900">{selectedOrder.vendor.address}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-green-700">Email</Label>
                        <p className="text-green-900">{selectedOrder.vendor.email}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-green-700">Specializations</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedOrder.vendor.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Custom Design Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-900">
                        This is a custom design order. The design was created by the customer and uploaded directly.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 