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

interface OrderDialogProps {
  product?: Product;
  decoration?: Decoration;
}

export default function OrderDialog({ product, decoration }: OrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product || null);
  const [quantity, setQuantity] = useState(1);
  const [designType, setDesignType] = useState<'premade' | 'custom'>('premade');
  const [selectedDesign, setSelectedDesign] = useState<string>(decoration?.name || '');
  const [customDesignFile, setCustomDesignFile] = useState<File | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { products } = productsData;
  const { decorations } = decorationsData;

  // If decoration is provided, set design type to premade
  React.useEffect(() => {
    if (decoration) {
      setDesignType('premade');
      setSelectedDesign(decoration.name);
    }
  }, [decoration]);

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

  const handleSubmit = async () => {
    if (!customerName || !customerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    // For product orders, validate product selection
    if (!selectedProduct && !decoration) {
      toast.error('Please select a product or decoration');
      return;
    }

    if (selectedProduct && designType === 'premade' && !selectedDesign) {
      toast.error('Please select a design');
      return;
    }

    if (selectedProduct && designType === 'custom' && !customDesignFile) {
      toast.error('Please upload a custom design');
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle custom design upload
      let customDesignFileName = '';
      if (designType === 'custom' && customDesignFile) {
        const formData = new FormData();
        formData.append('file', customDesignFile);
        
        // Upload file to server
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload custom design');
        }

        const uploadResult = await uploadResponse.json();
        customDesignFileName = uploadResult.filename;
        toast.success('Custom design uploaded successfully');
      }

      // Create order data
      const orderData = {
        designType,
        selectedDesign: designType === 'premade' ? selectedDesign : undefined,
        customDesignFile: designType === 'custom' ? customDesignFileName : undefined,
        customerName,
        customerEmail,
        notes
      };

      // Add product-specific data if product is selected
      if (selectedProduct) {
        const basePrice = selectedProduct.basePrice;
        const finalPrice = quantity >= selectedProduct.bulkThreshold 
          ? selectedProduct.bulkPrice 
          : basePrice;
        const totalPrice = finalPrice * quantity;

        Object.assign(orderData, {
          productName: selectedProduct.name,
          productType: selectedProduct.type,
          quantity,
          basePrice: finalPrice,
          totalPrice,
        });
      }

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        setOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setDesignType('premade');
    setSelectedDesign(decoration?.name || '');
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Place Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Your Order</DialogTitle>
          <DialogDescription>
            Customize your product and provide your details to complete the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Selection - Only show if no product is pre-selected */}
          {!product && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Product Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product">Product</Label>
                    <Select 
                      value={selectedProduct?.name || ''} 
                      onValueChange={(value) => {
                        const product = products.find(p => p.name === value);
                        setSelectedProduct(product || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name} - ${product.basePrice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedProduct?.quantity || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    />
                    {selectedProduct && (
                      <p className="text-sm text-gray-500 mt-1">
                        Available: {selectedProduct.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quantity Selection - Always show for all orders */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Quantity Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {product.quantity}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Design Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!decoration && (
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
              )}

              {designType === 'premade' ? (
                <div>
                  <Label htmlFor="design">Select Design</Label>
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
                  <Label htmlFor="custom-file">Upload Custom Design</Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Order Summary */}
          {(selectedProduct || decoration) && (
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProduct && (
                    <>
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
                    </>
                  )}
                  
                  {decoration && (
                    <div className="flex justify-between">
                      <span>Decoration:</span>
                      <span className="font-medium">{decoration.name}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Design Type:</span>
                    <span className="font-medium capitalize">{designType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 