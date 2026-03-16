type RoleName = "admin" | "driver" | "passenger";

export interface MeResponse {
    data: {
        id: number;
        email: string;
        is_active: boolean;
        role: {
            id: number;
            name: RoleName;
        };
        person: {
            id: number | null;
            pseudo: string | null;
            first_name: string | null;
            last_name: string | null;
            phone: string | null;
            car_id: number | null;
        } | null;
        permissions: {
            can_view_bookings: boolean;
            can_book_trip: boolean;
            can_cancel_booking: boolean;
            can_edit_profile: boolean;
            can_publish_trip: boolean;
            can_manage_own_trips: boolean;
            can_manage_all_trips: boolean;
            can_manage_all_users: boolean;
            can_manage_all_bookings: boolean;
        };
    };
}

export interface AuthPerson {
    id: number | null;
    pseudo: string | null;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    car_id: number | null;
}

export interface AuthPermissions {
    can_view_bookings: boolean;
    can_book_trip: boolean;
    can_cancel_booking: boolean;
    can_edit_profile: boolean;
    can_publish_trip: boolean;
    can_manage_own_trips: boolean;
    can_manage_all_trips: boolean;
    can_manage_all_users: boolean;
    can_manage_all_bookings: boolean;
}

export interface AuthUser {
    id: number;
    email: string;
    is_active: boolean;
    role: {
        id: number;
        name: RoleName;
    };
    person: AuthPerson | null;
    permissions: AuthPermissions;
}