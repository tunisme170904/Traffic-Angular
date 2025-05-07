// src/app/services/license-plate.service.ts
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { LICENSE_PLATES } from '../mocks/license-plates.mock';

@Injectable({ providedIn: 'root' })
export class LicensePlateService {
  getPlates() {
    return of(LICENSE_PLATES); // Giả lập API trả danh sách biển số
  }

  filterByType(type: string) {
    return of(LICENSE_PLATES.filter(p => p.type === type));
  }

  search(query: string) {
    const lowerQuery = query.toLowerCase();
  
    const filtered = LICENSE_PLATES.filter(p =>
      p.number.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery)
    );
  
    return of(filtered);
  }
}
