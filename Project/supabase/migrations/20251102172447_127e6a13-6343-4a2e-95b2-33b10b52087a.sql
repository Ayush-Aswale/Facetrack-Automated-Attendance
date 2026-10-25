-- Create users table for face enrollment
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  department TEXT,
  face_encoding TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (public access for demo purposes)
CREATE POLICY "Enable read access for all users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" 
ON public.users 
FOR UPDATE 
USING (true);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'present',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance table
CREATE POLICY "Enable read access for all users" 
ON public.attendance 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.attendance 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX idx_attendance_check_in_time ON public.attendance(check_in_time DESC);