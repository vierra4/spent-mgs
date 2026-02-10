from enum import Enum
# Roles hardcoded for now Hhh, for the MVP we will change later 
class Role(str, Enum):
    EMPLOYEE = "employee"
    MANAGER = "manager"
    FINANCE = "finance"
    ADMIN = "admin"
