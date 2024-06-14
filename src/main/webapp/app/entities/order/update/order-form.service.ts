import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOrder, NewOrder } from '../order.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOrder for edit and NewOrderFormGroupInput for create.
 */
type OrderFormGroupInput = IOrder | PartialWithRequiredKeyOf<NewOrder>;

type OrderFormDefaults = Pick<NewOrder, 'id'>;

type OrderFormGroupContent = {
  id: FormControl<IOrder['id'] | NewOrder['id']>;
  name: FormControl<IOrder['name']>;
  number: FormControl<IOrder['number']>;
  status: FormControl<IOrder['status']>;
  type: FormControl<IOrder['type']>;
  price: FormControl<IOrder['price']>;
  importDate: FormControl<IOrder['importDate']>;
  exportDate: FormControl<IOrder['exportDate']>;
};

export type OrderFormGroup = FormGroup<OrderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OrderFormService {
  createOrderFormGroup(order: OrderFormGroupInput = { id: null }): OrderFormGroup {
    const orderRawValue = {
      ...this.getFormDefaults(),
      ...order,
    };
    return new FormGroup<OrderFormGroupContent>({
      id: new FormControl(
        { value: orderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(orderRawValue.name, {
        validators: [Validators.required],
      }),
      number: new FormControl(orderRawValue.number, {
        validators: [Validators.required],
      }),
      status: new FormControl(orderRawValue.status, {
        validators: [Validators.required],
      }),
      type: new FormControl(orderRawValue.type, {
        validators: [Validators.required],
      }),
      price: new FormControl(orderRawValue.price, {
        validators: [Validators.required],
      }),
      importDate: new FormControl(orderRawValue.importDate),
      exportDate: new FormControl(orderRawValue.exportDate),
    });
  }

  getOrder(form: OrderFormGroup): IOrder | NewOrder {
    return form.getRawValue() as IOrder | NewOrder;
  }

  resetForm(form: OrderFormGroup, order: OrderFormGroupInput): void {
    const orderRawValue = { ...this.getFormDefaults(), ...order };
    form.reset(
      {
        ...orderRawValue,
        id: { value: orderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OrderFormDefaults {
    return {
      id: null,
    };
  }
}
