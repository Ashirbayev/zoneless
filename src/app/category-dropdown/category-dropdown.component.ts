import { Component, OnInit, HostListener } from '@angular/core';
import { IndexedDbService } from '../indexed-db.service';

@Component({
  selector: 'app-category-dropdown',
  templateUrl: './category-dropdown.component.html',
  styleUrls: ['./category-dropdown.component.scss']
})
export class CategoryDropdownComponent implements OnInit {
  categories = [
    { name: 'Неразобранное', color: 'blue', checked: false },
    { name: 'Переговоры', color: 'yellow', checked: false },
    { name: 'Принимают решение', color: 'green', checked: false },
    { name: 'Успешно', color: 'lightgreen', checked: false },
    { name: 'Сотрудники', color: 'gray', checked: false },
    { name: 'Партнёры', color: 'purple', checked: false },
    { name: 'Ивент', color: 'orange', checked: false },
    { name: 'Входящие обращения', color: 'lightblue', checked: false }
  ];

  selectedCategories: any[] = [];
  count: number = 0;
  isDropdownOpen = false;

  constructor(private indexedDbService: IndexedDbService) { }

  ngOnInit(): void {
    this.indexedDbService.loadState().then((state: any) => {
      if (state && state.length) {
        this.categories.forEach(category => {
          const savedCategory = state.find((s: any) => s.name === category.name);
          if (savedCategory) {
            category.checked = savedCategory.checked;
          }
        });

        this.count = this.categories.filter(category => category.checked).length;
      }
    });
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedCategories = [];
      this.categories.forEach(category => category.checked = false);
    } else {
      this.selectedCategories = [...this.categories];
      this.categories.forEach(category => category.checked = true);
    }
    this.saveState();
  }

  toggleCategory(category: any): void {
    category.checked = !category.checked;
    if (category.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.saveState();
  }

  isCategorySelected(category: any): boolean {
    return this.selectedCategories.includes(category);
  }

  isAllSelected(): boolean {
    return this.categories.every(category => category.checked);
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: MouseEvent): void {
    if (!this.isDropdownOpen || !event.target || this.isDropdownButton(event.target)) {
      return;
    }
    this.isDropdownOpen = false;
  }

  isDropdownButton(target: EventTarget): boolean {
    return (target as HTMLElement).closest('.dropdown') !== null;
  }

  saveState(): void {
    this.indexedDbService.saveState(this.categories);
    this.count = this.categories.filter(category => category.checked).length;
  }

  loadState(): void {
    this.indexedDbService.loadState().then(state => {
      this.selectedCategories = state;
    });
  }
}
