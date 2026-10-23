import { Request, Response } from 'express';
import { StoreService } from '../services/store.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { Service } from '@fixnear/shared';

export class ServiceController {
  private store: StoreService;

  constructor() {
    this.store = StoreService.getInstance();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, categorySlug } = req.query;

    let list = Array.from(this.store.services.values());

    if (categoryId) {
      list = list.filter(s => s.categoryId === categoryId);
    } else if (categorySlug) {
      const cat = Array.from(this.store.categories.values()).find(c => c.slug === categorySlug);
      if (cat) {
        list = list.filter(s => s.categoryId === cat.id);
      }
    }

    if (req.query.all !== 'true') {
      list = list.filter(s => s.isActive);
    }

    // Attach category object
    const enriched = list.map(s => ({
      ...s,
      category: this.store.categories.get(s.categoryId),
    }));

    sendSuccess(res, enriched);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const service = Array.from(this.store.services.values()).find(s => s.id === id || s.slug === id);

    if (!service) {
      sendError(res, 'SERVICE_NOT_FOUND', 'Service not found', 404);
      return;
    }

    sendSuccess(res, {
      ...service,
      category: this.store.categories.get(service.categoryId),
    });
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { categoryId, name, slug, description, basePrice, pricingType, estimatedDurationMinutes = 60, imageUrl, isActive = true } = req.body;

    const cat = this.store.categories.get(categoryId);
    if (!cat) {
      sendError(res, 'CATEGORY_NOT_FOUND', 'Parent category does not exist', 404);
      return;
    }

    const id = `srv-${Date.now()}`;
    const newService: Service = {
      id,
      categoryId,
      category: cat,
      name,
      slug,
      description,
      basePrice,
      pricingType,
      estimatedDurationMinutes,
      imageUrl: imageUrl || null,
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.services.set(id, newService);
    sendSuccess(res, newService, 'Service created successfully', 201);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const srv = this.store.services.get(id);

    if (!srv) {
      sendError(res, 'SERVICE_NOT_FOUND', 'Service not found', 404);
      return;
    }

    Object.assign(srv, req.body, { updatedAt: new Date().toISOString() });
    this.store.services.set(id, srv);

    sendSuccess(res, srv, 'Service updated successfully');
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!this.store.services.has(id)) {
      sendError(res, 'SERVICE_NOT_FOUND', 'Service not found', 404);
      return;
    }

    this.store.services.delete(id);
    sendSuccess(res, { id }, 'Service deleted successfully');
  };
}
