import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { Category } from '@fixnear/shared';

export class CategoryController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const list = Array.from(this.store.categories.values())
      .filter(c => req.query.all === 'true' ? true : c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // Compute service count dynamically
    const enriched = list.map(cat => {
      const count = Array.from(this.store.services.values()).filter(s => s.categoryId === cat.id && s.isActive).length;
      return { ...cat, serviceCount: count };
    });

    sendSuccess(res, enriched);
  };

  public getBySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const cat = Array.from(this.store.categories.values()).find(c => c.slug === slug || c.id === slug);

    if (!cat) {
      sendError(res, 'CATEGORY_NOT_FOUND', 'Service category not found', 404);
      return;
    }

    const services = Array.from(this.store.services.values()).filter(s => s.categoryId === cat.id && s.isActive);

    sendSuccess(res, { category: cat, services });
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { name, slug, description, iconName = 'Wrench', imageUrl, displayOrder = 0, isActive = true } = req.body;

    const existing = Array.from(this.store.categories.values()).find(c => c.slug === slug || c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      sendError(res, 'CATEGORY_EXISTS', 'Category with this name or slug already exists', 409);
      return;
    }

    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      id,
      name,
      slug,
      description,
      iconName,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600',
      isActive,
      displayOrder,
      serviceCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.categories.set(id, newCat);
    sendSuccess(res, newCat, 'Category created successfully', 201);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const cat = this.store.categories.get(id);

    if (!cat) {
      sendError(res, 'CATEGORY_NOT_FOUND', 'Category not found', 404);
      return;
    }

    Object.assign(cat, req.body, { updatedAt: new Date().toISOString() });
    this.store.categories.set(id, cat);

    sendSuccess(res, cat, 'Category updated successfully');
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!this.store.categories.has(id)) {
      sendError(res, 'CATEGORY_NOT_FOUND', 'Category not found', 404);
      return;
    }

    this.store.categories.delete(id);
    sendSuccess(res, { id }, 'Category deleted successfully');
  };
}
