export interface CustomerAttributes {
    id?: string;
    name: string;
    email: string;
    phone: string;
}

export class Customer {
    public readonly name: string;
    public readonly email: string;
    public readonly phone: string;
    public readonly id?: string;

    constructor(attr: CustomerAttributes) {
        this.name = attr.name;
        this.email = attr.email;
        this.phone = attr.phone;
        this.id = attr?.id;
    }
}
