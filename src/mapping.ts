import {
  OnSaleOffer,
  OnSaleOfferComplete,
  OnSaleOfferRevoked,
} from "../generated/TradingPost/TradingPost"
import { BigInt } from "@graphprotocol/graph-ts"
import { SaleOffer } from "../generated/schema"

export function handleOnSaleOffer(event: OnSaleOffer): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let saleOffer = new SaleOffer(event.params.offerId.toString());
  saleOffer.amount = event.params.amount;
  saleOffer.expiry = event.params.expiry;
  saleOffer.feeFlat = event.params.feeFlat;
  saleOffer.feePercent = event.params.feePercent;
  saleOffer.price = event.params.price;
  if (event.params.amount > BigInt.fromI32(0))
    saleOffer.unitPrice = event.params.price / event.params.amount;
  saleOffer.seller = event.params.seller;
  saleOffer.tokenId = event.params.tokenId;
  saleOffer.creationBlock = event.block.number;
  saleOffer.creationTimestamp = event.block.timestamp;
  saleOffer.collected = false;
  saleOffer.save();
}

export function handleOnSaleOfferComplete(event: OnSaleOfferComplete): void {
  let saleOffer = SaleOffer.load(event.params.offerId.toString()) as SaleOffer;
  saleOffer.buyer = event.params.buyer;
  saleOffer.soldBlock = event.block.number;
  saleOffer.soldTimestamp = event.block.timestamp;
  saleOffer.collected = true;
  saleOffer.save();
}

export function handleOnSaleOfferRevoked(event: OnSaleOfferRevoked): void {
  let saleOffer = SaleOffer.load(event.params.offerId.toString()) as SaleOffer;
  saleOffer.collected = true;
  saleOffer.save();
}

