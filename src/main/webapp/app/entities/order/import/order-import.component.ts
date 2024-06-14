import { Component } from '@angular/core';
import { OrderService } from '../service/order.service';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'jhi-order-import',
  templateUrl: './order-import.component.html',
})
export class OrderImportComponent {
  selectedFile: File | null = null;

  constructor(protected orderService: OrderService, private router: Router) {} // Inject Router

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0) || null;
    this.selectedFile = file;
  }

  onCancel() {
    this.router.navigate(['/order']);
  }
  onFileSubmit() {
    if (this.selectedFile) {
      this.orderService.importOrdersFromExcel(this.selectedFile).subscribe(
        response => {
          // Handle response
          console.log(response);
          this.router.navigate(['/order']); // Navigate back to /order/import
        },
        error => {
          // Handle error
          console.error(error);
        }
      );
    } else {
      console.error('No file selected');
    }
  }
}
