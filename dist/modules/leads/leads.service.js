"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const leadevents_service_1 = require("../leadevents/leadevents.service");
let LeadsService = class LeadsService {
    constructor(prisma, leadEventsService) {
        this.prisma = prisma;
        this.leadEventsService = leadEventsService;
    }
    async create(createLeadDto, ip, userAgent) {
        const { utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landingPath, ...leadData } = createLeadDto;
        const lead = await this.prisma.lead.create({
            data: leadData,
            include: { customer: true },
        });
        await this.leadEventsService.createEvent({
            customerId: lead.customerId,
            leadId: lead.id,
            type: client_1.LeadEventType.LEAD_CREATED,
            metadata: {
                serviceType: lead.serviceType,
                propertyType: lead.propertyType,
                urgency: lead.urgency,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                utm_term,
                referrer,
                landingPath,
            },
            ip,
            userAgent,
        });
        return lead;
    }
    async findAll(query) {
        const { page, limit, serviceType, urgency, propertyType, customerId, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(serviceType && { serviceType }),
            ...(urgency && { urgency }),
            ...(propertyType && { propertyType }),
            ...(customerId && { customerId }),
            ...(search && {
                description: { contains: search, mode: 'insensitive' },
            }),
        };
        const [items, total] = await Promise.all([
            this.prisma.lead.findMany({
                where,
                skip,
                take: limit,
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.lead.count({ where }),
        ]);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        return this.prisma.lead.findUnique({
            where: { id },
            include: { customer: true, appointments: true },
        });
    }
    async update(id, data, ip, userAgent) {
        const { utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landingPath, ...leadData } = data;
        const lead = await this.prisma.lead.update({
            where: { id },
            data: leadData,
        });
        await this.leadEventsService.createEvent({
            customerId: lead.customerId,
            leadId: lead.id,
            type: client_1.LeadEventType.LEAD_UPDATED,
            metadata: {
                changedFields: Object.keys(data),
                ...data,
            },
            ip,
            userAgent,
        });
        return lead;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        leadevents_service_1.LeadEventsService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map