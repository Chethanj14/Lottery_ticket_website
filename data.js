// Data Management Module - Simulates Backend Functionality
class TickBuyEarnData {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize sample data if not exists
        if (!localStorage.getItem('tbe_draws')) {
            this.createSampleDraws();
        }
        if (!localStorage.getItem('tbe_tickets')) {
            this.createSampleTickets();
        }
        if (!localStorage.getItem('tbe_payments')) {
            this.createSamplePayments();
        }
        if (!localStorage.getItem('tbe_winners')) {
            this.createSampleWinners();
        }
    }

    createSampleDraws() {
        const draws = [
            {
                id: 1,
                drawDate: '2025-01-15T20:00:00',
                drawTime: '2025-01-15T20:00:00',
                status: 'SCHEDULED',
                totalAmount: 0,
                totalTickets: 0,
                prizeAmount: 0,
                createdAt: new Date().toISOString(),
                canParticipate: false,
                isParticipating: false
            },
            {
                id: 2,
                drawDate: '2025-01-20T20:00:00',
                drawTime: '2025-01-20T20:00:00',
                status: 'ACTIVE',
                totalAmount: 2500,
                totalTickets: 25,
                prizeAmount: 2250,
                createdAt: new Date().toISOString(),
                canParticipate: true,
                isParticipating: false
            },
            {
                id: 3,
                drawDate: '2025-01-10T20:00:00',
                drawTime: '2025-01-10T20:00:00',
                status: 'COMPLETED',
                totalAmount: 5000,
                totalTickets: 50,
                prizeAmount: 4500,
                createdAt: new Date().toISOString(),
                canParticipate: false,
                isParticipating: false
            }
        ];
        localStorage.setItem('tbe_draws', JSON.stringify(draws));
    }

    createSampleTickets() {
        const tickets = [
            { id: 1, number: '25-001', price: 25, status: 'Participating', drawId: 2 },
            { id: 2, number: '25-002', price: 25, status: 'Participating', drawId: 2 },
            { id: 3, number: '50-015', price: 50, status: 'Participating', drawId: 2 },
            { id: 4, number: '100-032', price: 100, status: 'Available', drawId: null },
            { id: 5, number: '250-089', price: 250, status: 'Sold', drawId: null }
        ];
        localStorage.setItem('tbe_tickets', JSON.stringify(tickets));
    }

    createSamplePayments() {
        const payments = [
            {
                id: 1,
                orderId: 'TBE_SAMPLE001',
                amount: 100,
                status: 'COMPLETED',
                upiId: 'user@okicici',
                phoneNumber: '9876543210',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('tbe_payments', JSON.stringify(payments));
    }

    createSampleWinners() {
        const winners = [
            {
                id: 1,
                drawId: 3,
                winnerName: 'Rahul Sharma',
                ticketNumber: '50-025',
                prizeAmount: 4500,
                drawDate: '2025-01-10T20:00:00',
                totalParticipants: 50,
                totalAmount: 5000
            }
        ];
        localStorage.setItem('tbe_winners', JSON.stringify(winners));
    }

    // Draw Management
    getUpcomingDraws() {
        const draws = JSON.parse(localStorage.getItem('tbe_draws') || '[]');
        const now = new Date();
        return draws.filter(draw => 
            new Date(draw.drawDate) > now && draw.status === 'SCHEDULED'
        );
    }

    getActiveDraws() {
        const draws = JSON.parse(localStorage.getItem('tbe_draws') || '[]');
        const now = new Date();
        return draws.filter(draw => 
            new Date(draw.drawDate) <= now && draw.status === 'ACTIVE'
        );
    }

    getCompletedDraws() {
        const draws = JSON.parse(localStorage.getItem('tbe_draws') || '[]');
        return draws.filter(draw => draw.status === 'COMPLETED');
    }

    // Ticket Management
    getMyTickets() {
        return JSON.parse(localStorage.getItem('tbe_tickets') || '[]');
    }

    buyTickets(userId, ticketIds, amount) {
        // Simulate ticket purchase
        const tickets = this.getMyTickets();
        const selectedTickets = tickets.filter(t => ticketIds.includes(t.id));
        
        // Mark tickets as sold
        selectedTickets.forEach(ticket => {
            ticket.status = 'Sold';
        });
        
        localStorage.setItem('tbe_tickets', JSON.stringify(tickets));
        
        // Create payment record
        const payments = JSON.parse(localStorage.getItem('tbe_payments') || '[]');
        const payment = {
            id: payments.length + 1,
            orderId: 'TBE_' + Date.now(),
            amount: amount,
            status: 'COMPLETED',
            upiId: 'user@upi',
            phoneNumber: '9876543210',
            createdAt: new Date().toISOString()
        };
        payments.push(payment);
        localStorage.setItem('tbe_payments', JSON.stringify(payments));
        
        return { success: true, orderId: payment.orderId };
    }

    // Payment Simulation
    createPayment(paymentRequest) {
        const orderId = 'TBE_' + Date.now();
        const upiIntentUrl = `upi://pay?pa=${paymentRequest.upiId}&pn=TickBuyEarn&tn=Ticket%20Purchase&am=${paymentRequest.amount}&cu=INR&tn=${orderId}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiIntentUrl)}`;
        
        return {
            orderId: orderId,
            paymentId: 'pay_' + Date.now(),
            status: 'created',
            message: 'Payment order created successfully',
            upiIntentUrl: upiIntentUrl,
            qrCodeUrl: qrCodeUrl
        };
    }

    checkPaymentStatus(orderId) {
        // Simulate payment verification
        const payments = JSON.parse(localStorage.getItem('tbe_payments') || '[]');
        const payment = payments.find(p => p.orderId === orderId);
        
        if (payment) {
            return {
                status: 'COMPLETED',
                message: 'Payment completed successfully',
                transactionId: payment.id,
                amount: payment.amount,
                upiId: payment.upiId,
                timestamp: payment.createdAt
            };
        }
        
        return {
            status: 'PENDING',
            message: 'Payment is pending',
            transactionId: null,
            amount: 0,
            upiId: null,
            timestamp: new Date().toISOString()
        };
    }

    // Draw Participation
    participateInDraw(drawId, ticketIds) {
        const draws = JSON.parse(localStorage.getItem('tbe_draws') || '[]');
        const draw = draws.find(d => d.id === drawId);
        
        if (draw && draw.status === 'ACTIVE') {
            // Update draw totals
            const tickets = this.getMyTickets();
            const participatingTickets = tickets.filter(t => ticketIds.includes(t.id));
            
            draw.totalTickets += participatingTickets.length;
            draw.totalAmount += participatingTickets.reduce((sum, t) => sum + t.price, 0);
            draw.prizeAmount = draw.totalAmount * 0.9;
            
            localStorage.setItem('tbe_draws', JSON.stringify(draws));
            
            // Mark tickets as participating
            participatingTickets.forEach(ticket => {
                ticket.status = 'Participating';
                ticket.drawId = drawId;
            });
            localStorage.setItem('tbe_tickets', JSON.stringify(tickets));
            
            return true;
        }
        return false;
    }

    // Winner Selection
    selectWinner(drawId) {
        const draws = JSON.parse(localStorage.getItem('tbe_draws') || '[]');
        const draw = draws.find(d => d.id === drawId);
        
        if (draw && draw.status === 'ACTIVE') {
            const tickets = this.getMyTickets();
            const participatingTickets = tickets.filter(t => t.drawId === drawId && t.status === 'Participating');
            
            if (participatingTickets.length > 0) {
                // Random winner selection
                const winnerIndex = Math.floor(Math.random() * participatingTickets.length);
                const winningTicket = participatingTickets[winnerIndex];
                
                // Update draw status
                draw.status = 'COMPLETED';
                localStorage.setItem('tbe_draws', JSON.stringify(draws));
                
                // Create winner record
                const winners = JSON.parse(localStorage.getItem('tbe_winners') || '[]');
                const winner = {
                    id: winners.length + 1,
                    drawId: drawId,
                    winnerName: 'Winner ' + winningTicket.number,
                    ticketNumber: winningTicket.number,
                    prizeAmount: draw.prizeAmount,
                    drawDate: draw.drawDate,
                    totalParticipants: participatingTickets.length,
                    totalAmount: draw.totalAmount
                };
                winners.push(winner);
                localStorage.setItem('tbe_winners', JSON.stringify(winners));
                
                return winner;
            }
        }
        return null;
    }
}

// Create global instance
window.tickBuyEarnData = new TickBuyEarnData();
