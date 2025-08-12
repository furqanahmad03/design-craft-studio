import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '../types/Product';
import productsData from '../app/api/data/products.json';
import { Star, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ProductsBar() {
  const products: Product[] = productsData.products;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Products</h2>
        <p className="text-gray-600">High-quality products for your custom needs</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg sm:text-xl text-gray-900 mb-2">
                    {product.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {product.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.brand}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {product.material}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ${product.basePrice}
                  </div>
                  {product.bulkPrice && (
                    <div className="text-sm text-gray-500">
                      Bulk: ${product.bulkPrice}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className="font-medium text-gray-900">{product.quantity} units</span>
                </div>
                
                {product.color && product.color.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Colors:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.color.map((color: string, colorIndex: number) => (
                        <Badge 
                          key={colorIndex} 
                          variant="outline" 
                          className="text-xs px-2 py-1"
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.bulkThreshold && product.bulkPrice && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">
                      Bulk Discount Available!
                    </div>
                    <div className="text-xs text-blue-700">
                      Order {product.bulkThreshold}+ units and save ${(product.basePrice - product.bulkPrice).toFixed(2)} per unit
                    </div>
                  </div>
                )}

                {/* Vendor Information */}
                <div className="border-t pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Vendor Info
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{product.vendor.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-gray-600">{product.vendor.rating}/5.0</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{product.vendor.timeline}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {product.vendor.specializations.slice(0, 2).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-1 py-0.5">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <div className="w-full text-center text-sm text-gray-500">
                Select this product in the order form above
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 