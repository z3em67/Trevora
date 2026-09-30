import React, { useState } from 'react'

function ProductImages({product}) {
  const [active, setActive] = useState(0)

  return (
    <div className="imgs_item">
      <div className="big_img">
        <img id="big_img" src={product.images[active]} alt={product.title} />
      </div>

      {product.images.length > 1 && (
        <div className="sm_img">
          {product.images.map((img, index) => (
            <button
              type="button"
              className={`img_div_sm ${index === active ? 'active' : ''}`}
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
