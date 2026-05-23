from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ======================================================
# DATABASE CONFIG
# ======================================================

DATABASE_URL = "sqlite:///./products.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

Base = declarative_base()

# ======================================================
# DATABASE MODEL
# ======================================================

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# ======================================================
# PYDANTIC SCHEMAS
# ======================================================

class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    quantity: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# ======================================================
# FASTAPI APP
# ======================================================

app = FastAPI(title="Product CRUD API")

# ======================================================
# DATABASE DEPENDENCY
# ======================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ======================================================
# CREATE PRODUCT
# ======================================================

@app.post(
    "/products/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity
    )

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product

# ======================================================
# GET ALL PRODUCTS
# ======================================================

@app.get(
    "/products/",
    response_model=list[ProductResponse]
)
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

# ======================================================
# GET SINGLE PRODUCT
# ======================================================

@app.get(
    "/products/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product

# ======================================================
# UPDATE PRODUCT
# ======================================================

@app.put(
    "/products/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    updated_product: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.description = updated_product.description
    product.price = updated_product.price
    product.quantity = updated_product.quantity

    db.commit()
    db.refresh(product)

    return product

# ======================================================
# DELETE PRODUCT
# ======================================================

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

# ======================================================
# RUN APPLICATION
# ======================================================
# Save this file as: main.py
#
# Install packages:
# pip install fastapi uvicorn sqlalchemy
#
# Run server:
# uvicorn main:app --reload
#
# Swagger UI:
# http://127.0.0.1:8000/docs