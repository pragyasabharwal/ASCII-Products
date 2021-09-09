const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [allProducts, setAllProducts] = React.useState();
  const [sortByPrice, setSortByPrice] = React.useState(false);
  const [sortByID, setSortByID] = React.useState(false);
  const [sortBySize, setSortBySize] = React.useState(false);
  const random = Math.floor(Math.random() * 1000 + Math.random() * 1000);

  React.useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        await fetch(
          `${window.location.href}api/products?_page=${page}&_limit=21`
        )
          .then((res) => res.json())
          .then((data) => {
            for (var i = 0; i < data.length; i++) {
              if (i % 20 === 0 && i !== 0) {
                data.splice(i, 0, `/ads/?r=${random}`);
              }
            }
            setProducts((prev) => prev.concat(data));
          });

        await fetch(`${window.location.href}api/products`)
          .then((res) => res.json())
          .then((data) => setAllProducts(data.length));

        if (sortByPrice) {
          setIsLoading(true);
          await fetch(`${window.location.href}api/products?_sort=price`)
            .then((res) => res.json())
            .then((data) => setProducts(data));
        }
        if (sortByID) {
          setIsLoading(true);
          await fetch(`${window.location.href}api/products?_sort=id`)
            .then((res) => res.json())
            .then((data) => setProducts(data));
        }
        if (sortBySize) {
          setIsLoading(true);
          await fetch(`${window.location.href}api/products?_sort=size`)
            .then((res) => res.json())
            .then((data) => setProducts(data));
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, sortByPrice, sortByID, sortBySize]);

  console.log("products", products);

  const observer = React.useRef();
  const lastEl = React.useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && products.length < allProducts) {
          console.log("check");
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [products, allProducts]
  );

  const formatDate = (date) => {
    var date = new Date(date);
    var today = new Date();
    const diffTime = Math.abs(today - date) / (1000 * 60 * 60 * 24);
    if (Math.floor(diffTime) === 0) {
      return "Today";
    }
    if (diffTime > 7) {
      return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    } else {
      return `${Math.floor(diffTime)} days ago`;
    }
  };

  return (
    <div>
      <div
        style={{
          border: "2px solid gray",
          padding: "1em",
          margin: "1em",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <div style={{ fontSize: "1.2em", fontWeight: "bolder" }}>Sort By:</div>
        <div>
          Price
          <input
            style={{ alignSelf: "center" }}
            name="sort"
            type="radio"
            checked={sortByPrice}
            onClick={() => setSortByPrice((prev) => !prev)}
          ></input>
        </div>
        <div>
          ID
          <input
            name="sort"
            type="radio"
            checked={sortByID}
            onClick={() => setSortByID((prev) => !prev)}
          ></input>
        </div>
        <div>
          Size
          <input
            type="radio"
            name="sort"
            checked={sortBySize}
            onClick={() => setSortBySize((prev) => !prev)}
          ></input>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridGap: "2px",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "1fr",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {products.map((item, index) => {
          console.log(typeof item);
          if (products.length === index + 1) {
            return (
              <div
                ref={lastEl}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {typeof item !== "string" && (
                  <div>
                    <div
                      key={item.id}
                      style={{
                        margin: "1.5em",
                        justifySelf: "center",
                        fontSize: `${item.size}px`,
                      }}
                    >
                      {item.face}
                    </div>
                    <div>$ {item.price / 100} </div>
                    <div>{formatDate(item.date)}</div>
                  </div>
                )}
                {typeof item === "string" && (
                  <img style={{ background: "yellow" }} src={item}></img>
                )}
              </div>
            );
          } else {
            return (
              <div>
                {typeof item !== "string" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      key={item.id}
                      style={{
                        margin: "1.5em",
                        justifySelf: "center",
                        fontSize: `${item.size}px`,
                      }}
                    >
                      {item.face}
                    </div>
                    <button
                      style={{
                        background: "green",
                        color: "white",
                        border: "none",
                        padding: "1em",
                      }}
                    >
                      $ {item.price / 100}{" "}
                    </button>
                    <div>{formatDate(item.date)}</div>
                  </div>
                )}
                {typeof item === "string" && (
                  <img style={{ background: "yellow" }} src={item}></img>
                )}
              </div>
            );
          }
        })}
      </div>
      {isLoading && <h1 style={{ margin: "1em" }}>Loading...</h1>}
      {products.length == allProducts && (
        <h1 style={{ margin: "1em" }}>End of catalogue...</h1>
      )}
    </div>
  );
};
