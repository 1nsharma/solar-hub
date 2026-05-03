export class InventoryManager {
    constructor(params) {
        this.params = params;
    }

    calculateEOQ() {
        const d = this.params.annualDemand;
        const s = this.params.orderCost;
        const h = this.params.unitPrice * this.params.holdingCostRate;
        return Math.round(Math.sqrt(2 * d * s / h));
    }

    calculateSafetyStock() {
        // Exact Z-value for typical service levels
        const zValues = {
            0.90: 1.28,
            0.95: 1.645,
            0.98: 2.05,
            0.99: 2.33,
            0.999: 3.09
        };
        const z = zValues[this.params.serviceLevel];
        if (z === undefined) {
            throw new Error(`Unsupported service level: ${this.params.serviceLevel}. Supported levels are: ${Object.keys(zValues).join(', ')}`);
        }
        
        const operatingDays = this.params.operatingDaysPerYear || 365;
        const leadTimeFactor = Math.sqrt(this.params.leadTimeDays / operatingDays);
        const sigmaDlt = this.params.demandStdDev * leadTimeFactor;
        return Math.round(z * sigmaDlt);
    }

    calculateReorderPoint() {
        const operatingDays = this.params.operatingDaysPerYear || 365;
        const dailyDemand = this.params.annualDemand / operatingDays;
        return Math.round(dailyDemand * this.params.leadTimeDays + this.calculateSafetyStock());
    }

    analyzeDeadStock(inventoryItems) {
        return inventoryItems.filter(item => {
            const leadTime = item.leadTimeDays || 30;
            const thresholdLow = Math.max(180, leadTime * 2);
            return item.lastMovementDays > thresholdLow || item.turnoverRate < 1.0;
        }).map(item => {
            const leadTime = item.leadTimeDays || 30;
            const thresholdHigh = Math.max(365, leadTime * 4);
            const thresholdMedium = Math.max(270, leadTime * 3);
            
            let action, urgency;
            if (item.lastMovementDays > thresholdHigh) {
                action = 'Recommend write-off or discounted disposal';
                urgency = 'High';
            } else if (item.lastMovementDays > thresholdMedium) {
                action = 'Contact supplier for return or exchange';
                urgency = 'Medium';
            } else {
                action = 'Markdown sale or internal transfer to consume';
                urgency = 'Low';
            }
            return {
                sku: item.sku,
                quantity: item.quantity,
                value: item.quantity * item.unitPrice,
                idleDays: item.lastMovementDays,
                action,
                urgency
            };
        });
    }

    getStrategyReport() {
        const eoq = this.calculateEOQ();
        const safetyStock = this.calculateSafetyStock();
        const rop = this.calculateReorderPoint();
        const annualOrders = Math.round(this.params.annualDemand / eoq);
        const totalCost = (this.params.annualDemand * this.params.unitPrice) + 
                          (annualOrders * this.params.orderCost) + 
                          ((eoq / 2 + safetyStock) * this.params.unitPrice * this.params.holdingCostRate);
        
        return {
            eoq,
            safetyStock,
            reorderPoint: rop,
            annualOrders,
            totalAnnualCost: Math.round(totalCost * 100) / 100,
            avgInventory: Math.round(eoq / 2 + safetyStock),
            inventoryTurns: Math.round((this.params.annualDemand / (eoq / 2 + safetyStock)) * 10) / 10
        };
    }
}

export class SupplyChainRiskManager {
    assessRisk(supplierData) {
        const riskScores = {};
        
        if ((supplierData.spendShare || 0) > 0.3) {
            riskScores.concentrationRisk = 'High';
        } else if ((supplierData.spendShare || 0) > 0.15) {
            riskScores.concentrationRisk = 'Medium';
        } else {
            riskScores.concentrationRisk = 'Low';
        }

        if ((supplierData.alternativeSuppliers || 0) === 0) {
            riskScores.singleSourceRisk = 'High';
        } else if ((supplierData.alternativeSuppliers || 0) === 1) {
            riskScores.singleSourceRisk = 'Medium';
        } else {
            riskScores.singleSourceRisk = 'Low';
        }

        const creditScore = supplierData.creditScore || 50;
        if (creditScore < 40) {
            riskScores.financialRisk = 'High';
        } else if (creditScore < 60) {
            riskScores.financialRisk = 'Medium';
        } else {
            riskScores.financialRisk = 'Low';
        }

        const weights = { High: 3, Medium: 1, Low: 0 };
        const totalScore = Object.values(riskScores).reduce((acc, severity) => acc + (weights[severity] || 0), 0);

        let overall = '';
        if (totalScore >= 4 || Object.values(riskScores).filter(v => v === 'High').length >= 2) {
            overall = 'Red Alert - Immediate contingency plan required';
        } else if (totalScore >= 2 || Object.values(riskScores).includes('High')) {
            overall = 'Orange Watch - Improvement plan needed';
        } else {
            overall = 'Green Normal - Continue routine monitoring';
        }

        const actions = [];
        if (riskScores.concentrationRisk === 'High') {
            actions.push('Immediately begin alternative supplier development — target qualification within 3 months');
        }
        if (riskScores.singleSourceRisk === 'High') {
            actions.push('Single-source materials must have at least 1 alternative supplier developed within 6 months');
        }
        if (riskScores.financialRisk === 'High') {
            actions.push('Shorten payment terms to prepayment or cash-on-delivery, increase incoming inspection frequency');
        }

        return {
            detailScores: riskScores,
            overallRisk: overall,
            recommendedActions: actions
        };
    }
}
