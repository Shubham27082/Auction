package com.ipl.auction.repository;

import com.ipl.auction.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionIdOrderByBidTimeDesc(Long auctionId);
    List<Bid> findByTeamIdOrderByBidTimeDesc(Long teamId);
}
