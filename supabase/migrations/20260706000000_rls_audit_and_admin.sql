-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'connector')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
    CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

    DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
    CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
END $$;

-- Admin verification function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Orders table RLS
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders Policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
        CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (profile_id = auth.uid());
        
        DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
        CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (profile_id = auth.uid() OR profile_id IS NULL);

        DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
        CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (is_admin());
        
        DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
        CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (is_admin());
    END IF;
END $$;

-- Order Items Policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
        DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
        CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND profile_id = auth.uid())
        );

        DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
        CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND (profile_id = auth.uid() OR profile_id IS NULL))
        );
        
        DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
        CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (is_admin());
        
        DROP POLICY IF EXISTS "Admins can update all order items" ON public.order_items;
        CREATE POLICY "Admins can update all order items" ON public.order_items FOR UPDATE USING (is_admin());
    END IF;
END $$;
