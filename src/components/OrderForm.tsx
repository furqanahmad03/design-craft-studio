'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShoppingCart, Upload, Palette, CheckCircle } from 'lucide-react';
import { Product } from '../types/Product';
import { Decoration } from '../types/Decoration';
import productsData from '../app/api/data/products.json';
import decorationsData from '../app/api/data/decorations.json';
import React from 'react';

export default function OrderForm() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDecoration, setSelectedDecoration] = useState<Decoration | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [designType, setDesignType] = useState<'premade' | 'custom'>('premade');
  const [selectedDesign, setSelectedDesign] = useState<string>('');
  const [customDesignFile, setCustomDesignFile] = useState<File | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { products } = productsData;
  const { decorations } = decorationsData;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setCustomDesignFile(file);
      toast.success('Custom design uploaded successfully');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    const numValue = parseInt(value) || 0;
    const maxQuantity = selectedProduct?.quantity || 1;
    
    // Ensure quantity is within valid range
    if (numValue < 1) {
      setQuantity(1);
    } else if (numValue > maxQuantity) {
      setQuantity(maxQuantity);
      toast.error(`Maximum available quantity is ${maxQuantity}`);
    } else {
      setQuantity(numValue);
    }
  };

  const handleQuantityBlur = () => {
    // Ensure quantity is at least 1 when user leaves the field
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct && !selectedDecoration) {
      toast.error('Please select either a product or decoration');
      return;
    }

    if (selectedProduct && (!quantity || quantity < 1 || quantity > selectedProduct.quantity)) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      productName: selectedProduct?.name,
      productType: selectedProduct?.type,
      quantity: selectedProduct ? quantity : undefined,
      basePrice: selectedProduct?.basePrice,
      totalPrice: selectedProduct ? (selectedProduct.basePrice * quantity) : undefined,
      designType,
      selectedDesign: designType === 'premade' ? selectedDesign : undefined,
      customDesignFile: designType === 'custom' ? customDesignFile : undefined,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      status: 'pending' as const,
      vendor: selectedProduct?.vendor || selectedDecoration?.vendor,
      notes: notes.trim() || undefined
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        // Close the dialog
        setOpen(false);
        // Reset form
        setSelectedProduct(null);
        setSelectedDecoration(null);
        setQuantity(1);
        setDesignType('premade');
        setSelectedDesign('');
        setCustomDesignFile(null);
        setCustomerName('');
        setCustomerEmail('');
        setNotes('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setSelectedDecoration(null);
    setQuantity(1);
    setDesignType('premade');
    setSelectedDesign('');
    setCustomDesignFile(null);
    setCustomerName('');
    setCustomerEmail('');
    setNotes('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Place Your Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Your Order</DialogTitle>
          <DialogDescription>
            Select a product, customize your design, and provide your details to complete the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Product Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label htmlFor="product">Product *</Label>
                    <Select 
                      value={selectedProduct?.name || ''} 
                      onValueChange={(value) => {
                        const product = products.find(p => p.name === value);
                        setSelectedProduct(product || null);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            <div className="truncate">
                              {product.name} - ${product.basePrice}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct?.quantity || 1}
                      value={quantity}
                      onChange={handleQuantityChange}
                      onBlur={handleQuantityBlur}
                      className={quantity > (selectedProduct?.quantity || 0) ? 'border-red-500' : ''}
                    />
                    {selectedProduct && (
                      <div className="mt-1">
                        <p className={`text-sm ${quantity > selectedProduct.quantity ? 'text-red-600' : 'text-gray-500'}`}>
                          Available: {selectedProduct.quantity}
                        </p>
                        {quantity > selectedProduct.quantity && (
                          <p className="text-sm text-red-600 font-medium">
                            ⚠️ Quantity exceeds available stock
                          </p>
                        )}
                        {quantity === selectedProduct.quantity && (
                          <p className="text-sm text-orange-600 font-medium">
                            ⚠️ This is the last available item
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount Calculator */}
                {selectedProduct && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      💰 Bulk Discount Calculator
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="font-medium text-gray-700">Current Order</div>
                        <div className="text-xl lg:text-2xl font-bold text-blue-600 break-words">
                          ${quantity >= selectedProduct.bulkThreshold 
                            ? (selectedProduct.bulkPrice * quantity).toFixed(2)
                            : (selectedProduct.basePrice * quantity).toFixed(2)
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          {quantity} × ${quantity >= selectedProduct.bulkThreshold 
                            ? selectedProduct.bulkPrice 
                            : selectedProduct.basePrice
                          }
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="font-medium text-gray-700">Bulk Threshold</div>
                        <div className="text-xl lg:text-2xl font-bold text-green-600 break-words">
                          ${(selectedProduct.bulkPrice * selectedProduct.bulkThreshold).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedProduct.bulkThreshold} × ${selectedProduct.bulkPrice}
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="font-medium text-gray-700">Potential Savings</div>
                        <div className="text-xl lg:text-2xl font-bold text-purple-600 break-words">
                          ${((selectedProduct.basePrice - selectedProduct.bulkPrice) * selectedProduct.bulkThreshold).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Per {selectedProduct.bulkThreshold} items
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Recommendations */}
                    <div className="mt-3 space-y-2">
                      {quantity < selectedProduct.bulkThreshold && (
                        <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="text-sm text-yellow-800">
                            💡 Order {selectedProduct.bulkThreshold - quantity} more to unlock bulk pricing!
                          </span>
                        </div>
                      )}
                      
                      {quantity >= selectedProduct.bulkThreshold && (
                        <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                          <span className="text-sm text-green-800">
                            🎉 You&apos;re getting bulk pricing! Save ${((selectedProduct.basePrice - selectedProduct.bulkPrice) * quantity).toFixed(2)} on this order.
                          </span>
                        </div>
                      )}
                      
                      {/* Additional quantity suggestions */}
                      {selectedProduct.quantity >= selectedProduct.bulkThreshold * 2 && (
                        <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                          <span className="text-sm text-blue-800">
                            🚀 Order {selectedProduct.bulkThreshold * 2} items to save even more!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Design Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom-design"
                    checked={designType === 'custom'}
                    onCheckedChange={(checked) => 
                      setDesignType(checked ? 'custom' : 'premade')
                    }
                  />
                  <Label htmlFor="custom-design">Use Custom Design</Label>
                </div>

                {designType === 'premade' ? (
                  <div>
                    <Label htmlFor="design">Select Design *</Label>
                    <Select value={selectedDesign} onValueChange={setSelectedDesign}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a design" />
                      </SelectTrigger>
                      <SelectContent>
                        {decorations.map((decoration) => (
                          <SelectItem key={decoration.name} value={decoration.name}>
                            {decoration.name} ({decoration.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="custom-file">Upload Custom Design *</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        ref={fileInputRef}
                        id="custom-file"
                        type="file"
                        accept="image/*,.svg,.ai,.psd"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Choose File
                      </Button>
                      {customDesignFile && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {customDesignFile.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: JPG, PNG, SVG, AI, PSD (Max 5MB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Order Summary */}
            {selectedProduct && (
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Product:</span>
                      <span className="font-medium">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    
                    {/* Threshold Information */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span>Base Price:</span>
                        <span className="font-medium">${selectedProduct.basePrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bulk Threshold:</span>
                        <span className="font-medium">{selectedProduct.bulkThreshold} items</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Bulk Price:</span>
                        <span className="font-medium">${selectedProduct.bulkPrice}</span>
                      </div>
                    </div>

                    {/* Pricing Calculation */}
                    <div className="border-t pt-3">
                      {quantity >= selectedProduct.bulkThreshold ? (
                        <>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Regular Total:</span>
                            <span>${(selectedProduct.basePrice * quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Bulk Discount:</span>
                            <span>-${((selectedProduct.basePrice - selectedProduct.bulkPrice) * quantity).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold text-green-700">
                            <span>Final Total:</span>
                            <span>${(selectedProduct.bulkPrice * quantity).toFixed(2)}</span>
                          </div>
                          <div className="text-sm text-green-600 text-center bg-green-100 p-2 rounded">
                            🎉 You saved ${((selectedProduct.basePrice - selectedProduct.bulkPrice) * quantity).toFixed(2)} with bulk pricing!
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Unit Price:</span>
                            <span className="font-medium">${selectedProduct.basePrice}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${(selectedProduct.basePrice * quantity).toFixed(2)}</span>
                          </div>
                          {selectedProduct.bulkThreshold - quantity > 0 && (
                            <div className="text-sm text-blue-600 text-center bg-blue-100 p-2 rounded">
                              💡 Order {selectedProduct.bulkThreshold - quantity} more to get bulk pricing at ${selectedProduct.bulkPrice} each!
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        <DialogFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Placing Order...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 