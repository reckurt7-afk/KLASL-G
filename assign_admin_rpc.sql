-- This function allows super admins to assign a city to a user by email.
-- It uses SECURITY DEFINER to be able to read from auth.users.
CREATE OR REPLACE FUNCTION assign_city_admin_by_email(admin_email text, target_city_id int)
RETURNS text AS $$
DECLARE
    target_user_id uuid;
    is_super boolean;
BEGIN
    -- Check if the caller is a super admin
    SELECT role = 'super_admin' INTO is_super FROM user_roles WHERE user_id = auth.uid();
    IF NOT is_super THEN
        RETURN 'Error: Sadece süper adminler temsilci atayabilir.';
    END IF;

    -- Find the user by email in auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = admin_email;
    IF target_user_id IS NULL THEN
        RETURN 'Error: Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı. Lütfen önce siteye kayıt olmasını söyleyin.';
    END IF;

    -- Insert or update user_roles
    INSERT INTO user_roles (user_id, city_id, role)
    VALUES (target_user_id, target_city_id, 'city_admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET city_id = target_city_id, role = 'city_admin';

    RETURN 'Success: Temsilci başarıyla atandı.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
