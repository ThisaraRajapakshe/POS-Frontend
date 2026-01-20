import { CartItem, OrderCreateRequestDto } from '../models';
import { OrderResponseDto, OrderItemDto } from '../models/order.types';
import { Order, OrderItem, OrderStatus } from '../models/order.types';

export class OrderMapper {
  static fromDto(dto: OrderResponseDto): Order {
    return {
      id: dto.id,
      orderNumber: dto.orderNumber,
      orderDate: new Date(dto.orderDate), // Logic: String -> Date
      totalAmount: dto.totalAmount,
      status: dto.status as OrderStatus,  // Logic: String -> Enum
      items: dto.orderItems.map(item => OrderMapper.fromItemDto(item)),
    };
  }

  static fromItemDto(dto: OrderItemDto): OrderItem {
    return {
      name: dto.productName,
      price: dto.salesPrice,
      quantity: dto.quantity,
      total: dto.salesPrice * dto.quantity // Logic: Calculation
    };
  }
   static mapToOrderRequest(items: CartItem[], totalAmount: number): OrderCreateRequestDto {
    return {
      totalAmount: totalAmount,
      paymentMethod: 'Cash',
      isPending: false,
      orderItems: items.map(item => ({
        productLineItemId: item.lineItemId,
        salesPrice: item.price,
        quantity: item.quantity
      }))
    }
  }
}