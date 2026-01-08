import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../components/common/ToastProvider"; // ✅ استيراد من جديد
import "react-toastify/dist/ReactToastify.css";
import AuctionHeader from "../../features/auctions/auctiondetails/components/AuctionHeader";
import ImageGallery from "../../features/auctions/auctiondetails/components/ImageGallery";
import AuctionInfo from "../../features/auctions/auctiondetails/components/AuctionInfo";
import LocationSection from "../../features/auctions/auctiondetails/components/LocationSection";
import VideoGallery from "../../features/auctions/auctiondetails/components/VideoGallery";
import LoadingErrorState from "../../features/auctions/auctiondetails/components/LoadingErrorState";
import useAuctionData from "../../features/auctions/auctiondetails/hooks/useAuctionData";

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const { data, loading, error, refetch } = useAuctionData(id);
  const { showToast } = useToast();

  const handleBack = () => {
    navigate(-1);
  };
  console.log('Auction data:', data);


  const shareAuction = () => {
    if (!data) return;

    const currentUrl = window.location.href;
    const shareData = {
      title: data.title,
      text: `مزاد: ${data.title}`,
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(currentUrl);
      showToast("success", "تم نسخ الرابط للمشاركة!");
    }
  };

  if (loading || error || !data) {
    return (
      <LoadingErrorState
        loading={loading}
        error={error}
        onRetry={refetch}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 pt-[80px]" dir="rtl">
      <AuctionHeader onBack={handleBack} onShare={shareAuction} />

      <ImageGallery
        data={data}
        selectedImage={selectedImage}
        onSelectImage={setSelectedImage}
        showModal={showImageModal}
        onToggleModal={setShowImageModal}
      />

      <AuctionInfo data={data} />

      {data.latitude != null && data.longitude != null && (
        <LocationSection
          latitude={data.latitude}
          longitude={data.longitude}
          address={data.address}
          title={data.title}
        />
      )}

      {data.videos && data.videos.length > 0 && (
        <VideoGallery
          videos={data.videos}
          onSelectVideo={(video) => {
            setSelectedVideo(video);
            setShowVideoModal(true);
          }}
        />
      )}

      {/* Image Modal */}
      {showImageModal && (
        <ImageGallery.Modal
          images={getAllImages(data)}
          selectedIndex={selectedImage}
          onClose={() => setShowImageModal(false)}
          onChangeImage={setSelectedImage}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <VideoGallery.Modal
          video={selectedVideo}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

// Helper function for images (can also be moved to constants)
const getAllImages = (data) => {
  if (!data) return [];
  const images = [];
  if (data.cover_image) images.push(data.cover_image);
  if (data.images?.length > 0) {
    images.push(...data.images.map((img) => img.image_path));
  }
  return images;
};

export default AuctionDetailsPage;
