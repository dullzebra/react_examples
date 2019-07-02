import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardRaiting } from '_components/CardConfig/Card.js';
import { ProductCardTitle, ProductCardPrice} from '_components/CardConfig/ProductCard.js';
import { url } from '_config/config.js';

const BOUNDARY_COLOR = 9013641; // пограничный цвет фона, для перехода от чёрного шрифта к белому

class ProductCard extends React.Component {
  setTextColor = (bgColor) => {
    return (
      parseInt(bgColor.substring(1), 16) > BOUNDARY_COLOR
        ? '#000000'
        : '#ffffff'
    );
  };

  render() {
    const {
      title,
      id,
      files,
      expertRate,
      userRate,
      stores,
      size,
      thumbSize,
    } = this.props;

    let imgSrc, minPrice, bgColor;
    const mini = thumbSize || 'MINI1';
    try {
      imgSrc = files[0].thumbnails_url[mini];
      bgColor = files[0].dominant_color;
    } catch (e) {
      imgSrc = '';
      bgColor = '';
    }

    const prices = stores.map(store => store.price);
    minPrice = Math.min(...prices);
    minPrice = Number.isFinite(minPrice) ? minPrice : null;

    const itemUrl = `${url.page.productItem}${id}/`;
    const sizeClassName = size || 'ProductCardOneTwo';

    const textStyle = {
      [bgColor && 'color'] : this.setTextColor(bgColor),
    };

    return (
      <Card
        imgSrc={imgSrc}
        size={sizeClassName}
        key={id}
        bgColor={bgColor || '#fed058'}
        itemUrl={itemUrl}
        isTextClick
      >
        <ProductCardTitle title={title} style={textStyle} />
        <CardRaiting dark expertRate={expertRate} userRate={userRate} style={textStyle} />
        <ProductCardPrice price={minPrice} style={textStyle} />
      </Card>
    );
  }
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    thumbnails_url: PropTypes.object,
    dominant_color: PropTypes.string,
  })),
  expertRate: PropTypes.number,
  userRate: PropTypes.number,
  stores: PropTypes.arrayOf(PropTypes.shape({
    price: PropTypes.number,
    public_url: PropTypes.string,
  })),
  itemUrl: PropTypes.string,
  thumbSize: PropTypes.string,
};

export default ProductCard;
