from pydantic import BaseModel


class ContainerCreate(BaseModel):
    container_number: str
    container_type: str
    capacity: str


class ContainerUpdate(BaseModel):
    container_number: str
    container_type: str
    capacity: str
    status: str


class ContainerResponse(BaseModel):
    container_id: int
    container_number: str
    container_type: str
    capacity: str
    status: str

    class Config:
        from_attributes = True